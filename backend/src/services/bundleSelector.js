const prisma = require('../lib/prisma');

const round2 = (n) => Math.round(n * 100) / 100;
const num = (v) => (v == null ? 0 : Number(v));

/**
 * Input shape:
 * {
 *   eventType: string,
 *   guests: number,
 *   budget: number,
 *   items: [{ category: string, name?: string, quantity: number, unit?: string }]
 * }
 *
 * Output shape:
 * {
 *   eventType, guests, budget,
 *   bundles: [
 *     { label: 'economical' | 'quality' | 'budget',
 *       items: [{ category, name, quantity, unit, unitPrice, totalPrice, supplier: { ..., rating } }],
 *       totalPrice, averageRating, fitsBudget }
 *   ]
 * }
 */

async function loadProductsByCategory() {
  const products = await prisma.product.findMany({ include: { supplier: true } });
  const byCategory = new Map();
  for (const product of products) {
    const key = product.category.toLowerCase().trim();
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(product);
  }
  return byCategory;
}

function candidatesFor(item, byCategory) {
  const key = item.category.toLowerCase().trim();
  return byCategory.get(key) || byCategory.get('other') || [];
}

function buildBundleItem(item, product) {
  const unitPrice = num(product.price);
  return {
    category: item.category,
    name: product.name,
    quantity: item.quantity,
    unit: item.unit || 'item',
    unitPrice: round2(unitPrice),
    totalPrice: round2(unitPrice * item.quantity),
    supplier: {
      id: product.supplier.id,
      name: product.supplier.name,
      location: product.supplier.location,
      contact: product.supplier.contact,
      rating: product.supplier.rating != null ? num(product.supplier.rating) : null,
    },
  };
}

function summarize(items, budget) {
  const totalPrice = round2(items.reduce((s, it) => s + it.totalPrice, 0));
  const rated = items.filter((it) => it.supplier && it.supplier.rating != null);
  const averageRating = rated.length
    ? round2(rated.reduce((s, it) => s + it.supplier.rating, 0) / rated.length)
    : null;
  return { totalPrice, averageRating, fitsBudget: totalPrice <= budget };
}

// Cheapest product per requested item.
function pickEconomical(items, byCategory) {
  const picks = [];
  for (const item of items) {
    const candidates = candidatesFor(item, byCategory);
    if (candidates.length === 0) continue;
    const product = [...candidates].sort((a, b) => num(a.price) - num(b.price))[0];
    picks.push(buildBundleItem(item, product));
  }
  return picks;
}

// Highest-rated product per item; greedily downgrade to fit budget.
// Downgrade target: the swap with the best (dollars saved / rating lost) ratio.
function pickQuality(items, byCategory, budget) {
  const state = [];
  for (const item of items) {
    const candidates = candidatesFor(item, byCategory);
    if (candidates.length === 0) continue;
    const sorted = [...candidates].sort((a, b) => {
      const r = num(b.supplier.rating) - num(a.supplier.rating);
      return r !== 0 ? r : num(a.price) - num(b.price);
    });
    state.push({ item, product: sorted[0], candidates: sorted });
  }

  const totalOf = (s) =>
    s.reduce((sum, p) => sum + num(p.product.price) * p.item.quantity, 0);

  let total = totalOf(state);

  while (total > budget) {
    let bestIdx = -1;
    let bestAlt = null;
    let bestScore = -Infinity;

    for (let i = 0; i < state.length; i++) {
      const { item, product, candidates } = state[i];
      for (const alt of candidates) {
        const dollarsSaved = (num(product.price) - num(alt.price)) * item.quantity;
        if (dollarsSaved <= 0) continue;
        const ratingLost = Math.max(0, num(product.supplier.rating) - num(alt.supplier.rating));
        // Higher is better: more savings per unit of quality lost.
        const score = dollarsSaved / (ratingLost + 0.01);
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
          bestAlt = alt;
        }
      }
    }

    if (bestIdx === -1) break; // nothing left to downgrade
    state[bestIdx].product = bestAlt;
    total = totalOf(state);
  }

  return state.map(({ item, product }) => buildBundleItem(item, product));
}

// Maximize total spend without exceeding budget.
// Multiple-choice knapsack via DP over reachable totals (cents).
// Ties broken by higher rating sum.
function pickBudgetMax(items, byCategory, budget) {
  const groups = [];
  for (const item of items) {
    const candidates = candidatesFor(item, byCategory);
    if (candidates.length > 0) groups.push({ item, candidates });
  }
  if (groups.length === 0) return [];

  const SCALE = 100;
  const budgetCents = Math.floor(budget * SCALE);

  // key (cost in cents) -> { ratingSum, picks }
  let dp = new Map();
  dp.set(0, { ratingSum: 0, picks: [] });

  for (const { item, candidates } of groups) {
    const next = new Map();
    for (const [cost, state] of dp) {
      for (const product of candidates) {
        const priceCents =
          Math.round(num(product.price) * SCALE) * item.quantity;
        const newCost = cost + priceCents;
        if (newCost > budgetCents) continue;
        const ratingSum = state.ratingSum + num(product.supplier.rating);
        const existing = next.get(newCost);
        if (!existing || ratingSum > existing.ratingSum) {
          next.set(newCost, {
            ratingSum,
            picks: [...state.picks, { item, product }],
          });
        }
      }
    }
    if (next.size === 0) return []; // a group had no affordable option
    dp = next;
  }

  let bestCost = -1;
  let best = null;
  for (const [cost, state] of dp) {
    if (
      cost > bestCost ||
      (cost === bestCost && state.ratingSum > best.ratingSum)
    ) {
      bestCost = cost;
      best = state;
    }
  }

  if (!best) return [];
  return best.picks.map(({ item, product }) => buildBundleItem(item, product));
}

async function buildBundles(input) {
  const { eventType, guests, budget, items } = input || {};

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('items must be a non-empty array');
  }
  if (typeof budget !== 'number' || !Number.isFinite(budget) || budget <= 0) {
    throw new Error('budget must be a positive number');
  }

  const byCategory = await loadProductsByCategory();

  const economical = pickEconomical(items, byCategory);
  const quality = pickQuality(items, byCategory, budget);
  const budgetMax = pickBudgetMax(items, byCategory, budget);

  return {
    eventType,
    guests,
    budget,
    bundles: [
      { label: 'economical', items: economical, ...summarize(economical, budget) },
      { label: 'quality', items: quality, ...summarize(quality, budget) },
      { label: 'budget', items: budgetMax, ...summarize(budgetMax, budget) },
    ],
  };
}

module.exports = { buildBundles };
