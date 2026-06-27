/**
 * Adapter to the bundle-selection algorithm (owned by the algorithm team).
 *
 * The real implementation lives at `./bundleSelector.js` (the `Algorithm`
 * branch) and reads suppliers/products from the database. This adapter is the
 * single boundary the AI agent calls as a tool: it validates the input shape,
 * then delegates to `bundleSelector.buildBundles`. Until the algorithm branch is
 * merged into this one, `bundleSelector.js` is absent and we throw a clear,
 * actionable error instead of crashing the server at startup.
 *
 * Input shape:
 * {
 *   eventType: string,
 *   guests: number,
 *   budget: number,
 *   items: [{ category: string, name?: string, quantity: number, unit?: string }]
 * }
 *
 * Output shape (note: rating lives INSIDE supplier, and averageRating may be null):
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

/** Error thrown while the real algorithm module has not been merged in yet. */
class NotImplementedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotImplementedError';
  }
}

const ALLOWED_LABELS = ['economical', 'quality', 'budget'];

/**
 * Validate the algorithm input shape. Throws a descriptive Error on bad input so
 * malformed agent extractions fail loudly before reaching the algorithm.
 *
 * @param {*} input
 * @returns {{ eventType: string, guests: number, budget: number, items: Array }}
 */
function validateAlgoInput(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Algorithm input must be an object');
  }

  const { eventType, guests, budget, items } = input;

  if (typeof eventType !== 'string' || !eventType.trim()) {
    throw new Error('Algorithm input: "eventType" must be a non-empty string');
  }
  if (!Number.isFinite(Number(guests)) || Number(guests) <= 0) {
    throw new Error('Algorithm input: "guests" must be a positive number');
  }
  if (!Number.isFinite(Number(budget)) || Number(budget) <= 0) {
    throw new Error('Algorithm input: "budget" must be a positive number');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Algorithm input: "items" must be a non-empty array');
  }

  items.forEach((item, i) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Algorithm input: items[${i}] must be an object`);
    }
    if (typeof item.category !== 'string' || !item.category.trim()) {
      throw new Error(`Algorithm input: items[${i}].category must be a non-empty string`);
    }
    if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0) {
      throw new Error(`Algorithm input: items[${i}].quantity must be a positive number`);
    }
  });

  return {
    eventType: eventType.trim(),
    guests: Number(guests),
    budget: Number(budget),
    items: items.map((item) => ({
      category: item.category.trim(),
      name: typeof item.name === 'string' ? item.name.trim() : undefined,
      quantity: Number(item.quantity),
      unit: typeof item.unit === 'string' ? item.unit.trim() : undefined,
    })),
  };
}

/**
 * Lazily load the real algorithm. Returns its `buildBundles` or throws
 * NotImplementedError if the algorithm branch hasn't been merged yet.
 */
function loadSelector() {
  try {
    // Resolved at call time so a missing module doesn't break server startup.
    return require('./bundleSelector').buildBundles;
  } catch (err) {
    if (err && err.code === 'MODULE_NOT_FOUND') {
      throw new NotImplementedError(
        'bundleSelector is not available on this branch yet — merge the algorithm ' +
          'branch (origin/Algorithm) so backend/src/services/bundleSelector.js exists.'
      );
    }
    throw err;
  }
}

/**
 * Build the three event bundles (economical / quality / budget) from the input.
 * Validates first, then delegates to the algorithm team's bundleSelector.
 *
 * @param {object} input - see Input shape above
 * @returns {Promise<object>} - see Output shape above
 */
async function buildBundles(input) {
  const validated = validateAlgoInput(input);
  const selector = loadSelector();
  return selector(validated);
}

module.exports = { buildBundles, validateAlgoInput, NotImplementedError, ALLOWED_LABELS };
