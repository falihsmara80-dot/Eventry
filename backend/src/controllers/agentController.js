const { planEvent, NotImplementedError } = require('../services/agentService');

/**
 * POST /api/agent/plan
 * Body: { message: string }  — a free-text paragraph describing the event.
 *
 * Returns one of:
 *  - 200 { needsMoreInfo: true, hint }                  (model needs more detail)
 *  - 200 { result, summary, extractedInput }            (three bundles + prose)
 *  - 502 { error }                                      (algorithm/OpenAI failure)
 */
async function planWithAgent(req, res) {
  const { message } = req.body ?? {};

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required and must be a non-empty string' });
  }

  try {
    const outcome = await planEvent(message.trim());

    if (outcome.needsMoreInfo) {
      return res.json({
        needsMoreInfo: true,
        hint: outcome.hint || 'Please include the event type, guest count, and budget.',
      });
    }

    return res.json({
      needsMoreInfo: false,
      extractedInput: outcome.extractedInput,
      result: outcome.result,
      summary: outcome.summary,
    });
  } catch (err) {
    console.error('Agent planning failed:', err);

    // Make the "algorithm not wired in yet" case obvious rather than generic.
    if (err instanceof NotImplementedError) {
      return res.status(502).json({ error: err.message });
    }

    return res.status(502).json({ error: 'Failed to plan your event. Please try again.' });
  }
}

module.exports = { planWithAgent };
