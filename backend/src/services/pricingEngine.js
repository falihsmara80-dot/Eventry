// Mock per-unit price catalog (USD), keyed by lowercase category.
// Used until real Supplier/Product records are wired in via Prisma.
const PRICE_CATALOG = {
  venue: 500,
  catering: 18,
  decor: 8,
  entertainment: 250,
  photography: 300,
  'furniture & rentals': 12,
  staffing: 100,
  beverages: 6,
  favors: 5,
  'audio & visual': 200,
  other: 50,
};

const VARIANCE = 0.15; // +/- 15% randomness so prices feel less robotic
const SAFETY_BUFFER = 0.97; // leave a little headroom under the budget

const round2 = (n) => Math.round(n * 100) / 100;

function basePriceFor(category) {
  const base = PRICE_CATALOG[category.toLowerCase().trim()] ?? PRICE_CATALOG.other;
  const variance = 1 + (Math.random() * 2 - 1) * VARIANCE;
  return round2(base * variance);
}

function priceItems(items) {
  return items.map((item) => {
    const unitPrice = basePriceFor(item.category);
    return {
      ...item,
      unitPrice,
      totalPrice: round2(unitPrice * item.quantity),
    };
  });
}

function sumTotal(items) {
  return round2(items.reduce((sum, item) => sum + item.totalPrice, 0));
}

/**
 * Assigns realistic mock prices to AI-generated items, then scales prices
 * down (if needed) so the total never exceeds the requested budget.
 *
 * @param {Array<{category: string, name: string, quantity: number, unit: string}>} items
 * @param {number} budget
 * @returns {{ items: Array, totalEstimatedPrice: number, remainingBudget: number }}
 */
function applyBudgetConstraints(items, budget) {
  let priced = priceItems(items);
  let total = sumTotal(priced);

  if (budget > 0 && total > budget) {
    const scale = (budget / total) * SAFETY_BUFFER;
    priced = priced.map((item) => {
      const unitPrice = round2(item.unitPrice * scale);
      return { ...item, unitPrice, totalPrice: round2(unitPrice * item.quantity) };
    });
    total = sumTotal(priced);
  }

  return {
    items: priced,
    totalEstimatedPrice: total,
    remainingBudget: round2(budget - total),
  };
}

module.exports = { applyBudgetConstraints };
