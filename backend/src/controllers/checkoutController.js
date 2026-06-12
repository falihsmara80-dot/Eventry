const Stripe = require('stripe');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = Boolean(stripeSecretKey) && !stripeSecretKey.includes('replace');

const stripe = isStripeConfigured ? new Stripe(stripeSecretKey) : null;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5175';

async function createCheckoutSession(req, res) {
  if (!isStripeConfigured) {
    return res.status(503).json({
      error:
        'Stripe is not configured. Set a real STRIPE_SECRET_KEY in backend/.env to enable checkout.',
    });
  }

  const { eventType, items, totalEstimatedPrice, finalDetails } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items is required and must be a non-empty array' });
  }

  const { eventDate, eventTime, location, notes } = finalDetails ?? {};

  if (!eventDate || !eventTime || !location) {
    return res.status(400).json({
      error: 'finalDetails with eventDate, eventTime, and location is required',
    });
  }

  try {
    const lineItems = items.map((item) => {
      const quantity = Math.max(1, Math.round(Number(item.quantity)) || 1);
      const unitAmount = Math.max(0, Math.round(Number(item.unitPrice) * 100));

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: String(item.name),
            description: item.supplier?.name
              ? `via ${item.supplier.name} (${item.supplier.location})`
              : undefined,
          },
          unit_amount: unitAmount,
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/success`,
      cancel_url: `${FRONTEND_URL}/cancel`,
      metadata: {
        eventType: eventType ? String(eventType) : '',
        totalEstimatedPrice: totalEstimatedPrice != null ? String(totalEstimatedPrice) : '',
        eventDate: String(eventDate),
        eventTime: String(eventTime),
        location: String(location).slice(0, 500),
        notes: notes ? String(notes).slice(0, 500) : '',
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session creation failed:', err);
    res.status(502).json({ error: 'Failed to create checkout session. Please try again.' });
  }
}

module.exports = { createCheckoutSession };
