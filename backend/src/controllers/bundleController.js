const { generateEventBundle } = require('../services/bundleEngine');
const { applyBudgetConstraints } = require('../services/pricingEngine');
const { matchSuppliers } = require('../services/supplierMatch');
const { buildBundles } = require('../services/bundleSelector');

async function generateBundle(req, res) {
  const { eventType, guests, budget } = req.body ?? {};

  if (typeof eventType !== 'string' || !eventType.trim()) {
    return res.status(400).json({ error: 'eventType is required and must be a string' });
  }

  const guestCount = Number(guests);
  if (!Number.isFinite(guestCount) || guestCount <= 0) {
    return res.status(400).json({ error: 'guests is required and must be a positive number' });
  }

  const budgetAmount = Number(budget);
  if (!Number.isFinite(budgetAmount) || budgetAmount <= 0) {
    return res.status(400).json({ error: 'budget is required and must be a positive number' });
  }

  try {
    const items = await generateEventBundle({
      eventType: eventType.trim(),
      guests: guestCount,
      budget: budgetAmount,
    });

    const { items: pricedItems, totalEstimatedPrice, remainingBudget } =
      applyBudgetConstraints(items, budgetAmount);

    const matchedItems = await matchSuppliers(pricedItems);

    res.json({
      eventType: eventType.trim(),
      guests: guestCount,
      budget: budgetAmount,
      items: matchedItems,
      totalEstimatedPrice,
      remainingBudget,
    });
  } catch (err) {
    console.error('Bundle generation failed:', err);
    res.status(502).json({ error: 'Failed to generate bundle. Please try again.' });
  }
}

async function selectBundles(req, res) {
  const { eventType, guests, budget, items } = req.body ?? {};

  if (typeof eventType !== 'string' || !eventType.trim()) {
    return res.status(400).json({ error: 'eventType is required and must be a string' });
  }

  const guestCount = Number(guests);
  if (!Number.isFinite(guestCount) || guestCount <= 0) {
    return res.status(400).json({ error: 'guests is required and must be a positive number' });
  }

  const budgetAmount = Number(budget);
  if (!Number.isFinite(budgetAmount) || budgetAmount <= 0) {
    return res.status(400).json({ error: 'budget is required and must be a positive number' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items is required and must be a non-empty array' });
  }

  for (const [i, item] of items.entries()) {
    if (!item || typeof item.category !== 'string' || !item.category.trim()) {
      return res.status(400).json({ error: `items[${i}].category is required` });
    }
    const qty = Number(item.quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ error: `items[${i}].quantity must be a positive number` });
    }
  }

  try {
    const result = await buildBundles({
      eventType: eventType.trim(),
      guests: guestCount,
      budget: budgetAmount,
      items: items.map((it) => ({
        category: String(it.category).trim(),
        name: it.name ? String(it.name).trim() : undefined,
        quantity: Math.max(1, Math.round(Number(it.quantity))),
        unit: it.unit ? String(it.unit).trim() : 'item',
      })),
    });

    res.json(result);
  } catch (err) {
    console.error('Bundle selection failed:', err);
    res.status(500).json({ error: 'Failed to select bundles. Please try again.' });
  }
}

module.exports = { generateBundle, selectBundles };
