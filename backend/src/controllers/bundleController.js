const { generateEventBundle } = require('../services/bundleEngine');
const { applyBudgetConstraints } = require('../services/pricingEngine');
const { matchSuppliers } = require('../services/supplierMatch');

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

module.exports = { generateBundle };
