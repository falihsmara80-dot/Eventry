const OpenAI = require('openai');

const { CATEGORIES } = require('./bundleEngine');
const { buildBundles, NotImplementedError } = require('./bundleAlgorithm');

let _openai = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

// Small model used by the planning agent. Configurable so the algorithm/agent
// model can be bumped without a code change.
const AGENT_MODEL = process.env.OPENAI_AGENT_MODEL || 'gpt-4o-mini';

// Hard cap on tool-call iterations so a misbehaving model can't loop forever.
const MAX_TURNS = 4;

const SYSTEM_PROMPT = `You are Eventry's event-planning agent.

A user describes their event in a free-text paragraph. Your job:

1. Extract a structured plan from their words:
   { eventType, guests, budget, items: [{ category, name?, quantity, unit? }] }
   - "category" must be one of: ${CATEGORIES.join(', ')}, or "Other".
   - Infer a sensible list of 6-10 items for the event when the user does not
     spell each one out. Scale quantities with the guest count where it makes
     sense (catering, beverages, favors per guest; venue, photography flat).
   - Do NOT invent prices; pricing is handled by the tool.
   - Budget awareness: if the budget is low relative to the guest count, keep
     only the most essential categories (Venue and Catering are always core).
     Omit expensive optional categories like Entertainment, Photography, or
     Audio & Visual rather than including every possible service.

2. Decide whether you have enough to proceed:
   - eventType: Be maximally lenient. ANY word that hints at a gathering or
     occasion counts — "party", "dinner", "meeting", "launch", "birthday",
     "wedding", "corporate", "gathering", "get-together", "celebration", etc.
     If the user's message is even vaguely event-related, extract a reasonable
     eventType and proceed. If truly nothing is discernible, default to
     "Custom Event". NEVER refuse to call the tool because of an unclear event
     type.
   - guests and budget: These are the only two fields that may cause you to ask
     for more information. If EITHER is completely absent from the message,
     reply with a short friendly plain-text question asking only for that
     missing piece. Do NOT ask about the event type. If both guests and budget
     are present (or can be estimated), call the tool immediately.

3. If you have all three, call the build_bundles tool exactly once with the
   structured plan.

4. After the tool returns three bundles, write a short, warm summary (2-4
   sentences) contrasting the three tiers — economical, quality, and budget —
   mentioning their total price and whether each fits the budget. Keep it
   friendly and concise. Do NOT restate individual line items.
   IMPORTANT: Write plain prose only. No markdown, no asterisks, no bullet
   points, no bold or italic formatting of any kind.`;

// JSON-schema description of the algorithm's INPUT shape, exposed to the model
// as a callable tool.
const BUILD_BUNDLES_TOOL = {
  type: 'function',
  function: {
    name: 'build_bundles',
    description:
      'Build three event bundles (economical, quality, budget) from a structured event plan. ' +
      'Call this only when eventType, guests, and budget are all known.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        eventType: { type: 'string', description: 'e.g. "Wedding", "Birthday Party", "Corporate Event"' },
        guests: { type: 'integer', minimum: 1, description: 'Expected number of guests' },
        budget: { type: 'number', minimum: 1, description: 'Total budget in USD' },
        items: {
          type: 'array',
          minItems: 1,
          description: 'The item/service groups needed for the event',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              category: {
                type: 'string',
                enum: [...CATEGORIES, 'Other'],
              },
              name: { type: 'string', description: 'Specific item or service (optional)' },
              quantity: { type: 'integer', minimum: 1 },
              unit: { type: 'string', description: 'e.g. guest, hour, piece, package, staff (optional)' },
            },
            required: ['category', 'quantity'],
          },
        },
      },
      required: ['eventType', 'guests', 'budget', 'items'],
    },
  },
};

/**
 * Run the planning agent over a free-text paragraph.
 *
 * Drives a real OpenAI tool-calling loop: the model extracts a structured plan,
 * optionally calls the build_bundles tool (the teammate's algorithm), and then
 * summarizes the three returned bundles. If required fields are missing, the
 * model returns a plain-text hint and the tool is never called.
 *
 * @param {string} message - the user's paragraph
 * @returns {Promise<{
 *   needsMoreInfo: boolean,
 *   hint?: string,
 *   extractedInput?: object,
 *   result?: object,
 *   summary?: string,
 * }>}
 */
async function planEvent(message) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: message },
  ];

  let extractedInput;
  // Tracks whether we've already given the model a second chance to call the
  // tool. If the model declines twice we accept that it genuinely needs more
  // info from the user.
  let hasNudged = false;

  for (let turn = 0; turn < MAX_TURNS; turn += 1) {
    const completion = await getOpenAI().chat.completions.create({
      model: AGENT_MODEL,
      messages,
      tools: [BUILD_BUNDLES_TOOL],
      tool_choice: 'auto',
    });

    const choice = completion.choices[0]?.message;
    if (!choice) {
      throw new Error('OpenAI returned an empty response');
    }

    const toolCalls = choice.tool_calls ?? [];

    // No tool call → model either needs more info or is done after a tool ran.
    if (toolCalls.length === 0) {
      if (!extractedInput && !hasNudged) {
        // Give the model one more explicit chance before surfacing a validation
        // error to the user. This catches cases where the model is overly
        // cautious about a vague event type.
        hasNudged = true;
        messages.push(choice);
        messages.push({
          role: 'user',
          content:
            'Please call the build_bundles tool now using the information available. ' +
            'If the event type is unclear, use "Custom Event". ' +
            'Only skip the tool if both guest count and budget are completely absent.',
        });
        continue;
      }

      return {
        needsMoreInfo: !extractedInput,
        hint: !extractedInput ? choice.content ?? '' : undefined,
        extractedInput,
        summary: extractedInput ? choice.content ?? '' : undefined,
      };
    }

    // Echo the assistant's tool-call message back into the transcript.
    messages.push(choice);

    // Execute each requested tool call (we only expose build_bundles).
    for (const call of toolCalls) {
      if (call.function?.name !== 'build_bundles') {
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify({ error: `Unknown tool: ${call.function?.name}` }),
        });
        continue;
      }

      let args;
      try {
        args = JSON.parse(call.function.arguments || '{}');
      } catch {
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify({ error: 'Tool arguments were not valid JSON' }),
        });
        continue;
      }

      // Code-level fallback: never let an empty/vague event type reach the
      // builder or block bundle generation.
      if (!args.eventType || !args.eventType.trim()) {
        args.eventType = 'Custom Event';
      }

      extractedInput = args;
      const result = await buildBundles(args); // may throw NotImplementedError
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });

      // We have the structured result. Ask the model once more for the summary
      // prose, then return both together.
      const followUp = await getOpenAI().chat.completions.create({
        model: AGENT_MODEL,
        messages,
      });

      return {
        needsMoreInfo: false,
        extractedInput,
        result,
        summary: followUp.choices[0]?.message?.content ?? '',
      };
    }
  }

  throw new Error('Agent exceeded the maximum number of tool-call turns');
}

module.exports = { planEvent, AGENT_MODEL, NotImplementedError };
