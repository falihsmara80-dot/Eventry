const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CATEGORIES = [
  'Venue',
  'Catering',
  'Decor',
  'Entertainment',
  'Photography',
  'Furniture & Rentals',
  'Staffing',
  'Beverages',
  'Favors',
  'Audio & Visual',
];

const SYSTEM_PROMPT = `You are BundleAI, an expert event planner.

Given an event type, guest count, and total budget (USD), produce a list of
the items/services needed to put on the event.

Respond with ONLY a valid JSON object (no markdown, no commentary) in this
exact shape:

{
  "items": [
    {
      "category": "<one of: ${CATEGORIES.join(', ')}, or Other>",
      "name": "<specific item or service, e.g. 'Buffet-style dinner catering'>",
      "quantity": <integer >= 1>,
      "unit": "<e.g. guest, hour, piece, package, staff>"
    }
  ]
}

Rules:
- Generate between 6 and 10 line items.
- Cover the categories most relevant to this specific event type.
- Scale "quantity" sensibly with the guest count (e.g. catering, beverages,
  and favors should typically scale per guest; venue, entertainment, and
  photography are usually a flat quantity of 1).
- Do NOT include any pricing or cost fields - pricing is calculated separately.
- Do NOT include any text outside the single JSON object.`;

/**
 * Generate an AI-curated list of event bundle items.
 *
 * @param {Object} params
 * @param {string} params.eventType - e.g. "birthday", "wedding", "corporate"
 * @param {number} params.guests - expected number of guests
 * @param {number} params.budget - total budget in USD
 * @returns {Promise<Array<{category: string, name: string, quantity: number, unit: string}>>}
 */
async function generateEventBundle({ eventType, guests, budget }) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    temperature: 0.7,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Event type: ${eventType}\nGuests: ${guests}\nBudget: $${budget}\n\nGenerate the item list now.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error('OpenAI returned an empty response');
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('OpenAI response was not valid JSON');
  }

  if (!Array.isArray(parsed.items)) {
    throw new Error('OpenAI response did not include an "items" array');
  }

  return parsed.items
    .filter((item) => item && item.name)
    .map((item) => ({
      category:
        typeof item.category === 'string' && item.category.trim()
          ? item.category.trim()
          : 'Other',
      name: String(item.name).trim(),
      quantity: Math.max(1, Math.round(Number(item.quantity)) || 1),
      unit:
        typeof item.unit === 'string' && item.unit.trim()
          ? item.unit.trim()
          : 'item',
    }));
}

module.exports = { generateEventBundle, CATEGORIES };
