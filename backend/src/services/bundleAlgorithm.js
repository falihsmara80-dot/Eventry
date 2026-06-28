/**
 * Bundle-building adapter called by the AI agent.
 *
 * Primary path  : mockBundleBuilder — self-contained, no database required.
 *                 Always works in development without any infrastructure.
 * Upgrade path  : if bundleSelector.js is present AND a live database is
 *                 available, that real implementation is used instead.
 *
 * Output shape:
 * {
 *   eventType, guests, budget,
 *   bundles: [
 *     { label: 'economical' | 'quality' | 'budget',
 *       items: [{ category, name, quantity, unit, unitPrice, totalPrice,
 *                 supplier: { id, name, location, contact, rating } }],
 *       totalPrice, averageRating, fitsBudget }
 *   ]
 * }
 */

const { buildBundles: mockBuild } = require('./mockBundleBuilder');

class NotImplementedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotImplementedError';
  }
}

/**
 * Build the three event bundles from the agent's structured plan.
 * Falls back to the mock builder when the database is unavailable.
 *
 * @param {{ eventType, guests, budget, items }} input
 * @returns {Promise<object>}
 */
async function buildBundles(input) {
  // Try the database-backed algorithm first (only present after DB is wired in).
  try {
    const selector = require('./bundleSelector').buildBundles;
    return await selector(input);
  } catch (err) {
    // MODULE_NOT_FOUND  → bundleSelector hasn't been merged in yet.
    // Any Prisma/DB error (codes starting with 'P') → database not reachable.
    // Fall through to the mock builder in both cases.
    const isExpected =
      err.code === 'MODULE_NOT_FOUND' ||
      (typeof err.code === 'string' && err.code.startsWith('P')) ||
      /connect|database|prisma/i.test(err.message ?? '');

    if (!isExpected) throw err;
  }

  return mockBuild(input);
}

module.exports = { buildBundles, NotImplementedError };
