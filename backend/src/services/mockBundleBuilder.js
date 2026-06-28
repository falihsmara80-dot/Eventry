/**
 * Self-contained bundle builder — no database required.
 *
 * Each tier picks genuinely different vendors and products from the catalog
 * below, so bundles are distinct even when the items list is identical.
 *
 * Essential  ≈ 65 % of budget  (drops optional categories when budget is tight)
 * Quality    ≈ 95 % of budget  (scales prices if needed, keeps all items)
 * Luxe       ≈ 155 % of budget (no scaling — intentionally over budget)
 */

const round2 = (n) => Math.round(n * 100) / 100;

// Tiered catalog: each category has multiple options per tier.
// Unit prices for per-guest categories (catering, beverages, favors, staffing,
// furniture) are per-unit; flat categories (venue, decor, entertainment, etc.)
// are total per-event prices.
const CATALOG = {
  economical: {
    venue: [
      { name: 'Community Center Hall',     unitPrice: 1500, supplier: 'Community Spaces TLV',      location: 'Tel Aviv',               rating: 4.0 },
      { name: 'Public Park Event Permit',  unitPrice: 500,  supplier: 'Tel Aviv Municipality Parks',location: 'Tel Aviv',               rating: 3.8 },
      { name: 'Neighborhood Club Hall',    unitPrice: 900,  supplier: 'Local Events Haifa',         location: 'Haifa',                  rating: 3.9 },
    ],
    catering: [
      { name: 'Gourmet Pizza Truck',              unitPrice: 22, supplier: 'Pizza Express Events',       location: 'Tel Aviv',               rating: 4.1 },
      { name: 'Shawarma & Falafel Carts',         unitPrice: 18, supplier: 'Carmel Market Bites',        location: 'Carmel Market, Tel Aviv', rating: 4.3 },
      { name: 'DIY Buffet Package',               unitPrice: 15, supplier: 'Budget Catering IL',         location: 'Tel Aviv',               rating: 3.9 },
    ],
    decor: [
      { name: 'Basic Balloon Art Package',  unitPrice: 500,  supplier: 'BalloonArt Basic TLV',     location: 'Tel Aviv',               rating: 4.0 },
      { name: 'DIY Party Décor Kit',        unitPrice: 300,  supplier: 'Party Supplies TLV',       location: 'Tel Aviv',               rating: 3.8 },
      { name: 'Simple Floral Centerpieces', unitPrice: 600,  supplier: 'Budget Bloom',             location: 'Tel Aviv',               rating: 4.1 },
    ],
    entertainment: [
      { name: 'Local DJ Set (3 hours)',    unitPrice: 800,  supplier: 'Budget Beats TLV',          location: 'Tel Aviv',               rating: 4.0 },
      { name: 'Acoustic Guitarist Set',    unitPrice: 600,  supplier: 'Solo Performers IL',        location: 'Tel Aviv',               rating: 4.2 },
      { name: 'Open Mic Night Host',       unitPrice: 400,  supplier: 'Stage Door Events',         location: 'Tel Aviv',               rating: 3.9 },
    ],
    photography: [
      { name: 'Basic Photo Package (3h)', unitPrice: 800,  supplier: 'Snapshots TLV',              location: 'Tel Aviv',               rating: 4.0 },
      { name: 'Student Photographer',     unitPrice: 500,  supplier: 'Young Lens Collective',      location: 'Tel Aviv',               rating: 3.9 },
      { name: 'Digital Event Photos',     unitPrice: 900,  supplier: 'QuickClick Studios',         location: 'Tel Aviv',               rating: 4.1 },
    ],
    'furniture & rentals': [
      { name: 'Plastic Table & Chair Set', unitPrice: 4,   supplier: 'Budget Rentals TLV',         location: 'Tel Aviv',               rating: 4.0 },
      { name: 'Folding Tables Package',    unitPrice: 3,   supplier: 'Simple Rentals IL',          location: 'Tel Aviv',               rating: 3.8 },
    ],
    staffing: [
      { name: 'Event Volunteer Crew',   unitPrice: 80,  supplier: 'Event Crew IL',                 location: 'Tel Aviv',               rating: 4.0 },
      { name: 'Basic Waitstaff',        unitPrice: 100, supplier: 'Quick Staff TLV',               location: 'Tel Aviv',               rating: 4.1 },
    ],
    beverages: [
      { name: 'Soft Drinks & Water Package',  unitPrice: 8,  supplier: 'Basic Bar TLV',            location: 'Tel Aviv',               rating: 3.9 },
      { name: 'Coffee & Tea Station',         unitPrice: 12, supplier: 'The Roasting Bean Carts',  location: 'Givatayim',              rating: 4.8 },
    ],
    favors: [
      { name: 'Printed Sticker Set',  unitPrice: 3, supplier: 'Party Supplies TLV',                location: 'Tel Aviv',               rating: 3.8 },
      { name: 'Small Treat Bags',     unitPrice: 5, supplier: 'Budget Favors IL',                  location: 'Tel Aviv',               rating: 3.9 },
    ],
    'audio & visual': [
      { name: 'Basic PA System',         unitPrice: 300, supplier: 'Budget AV TLV',                location: 'Tel Aviv',               rating: 4.0 },
      { name: 'Bluetooth Speaker Setup', unitPrice: 200, supplier: 'Simple Sound IL',              location: 'Tel Aviv',               rating: 3.9 },
    ],
    other: [
      { name: 'General Event Services', unitPrice: 50, supplier: 'All-Round Events IL',            location: 'Tel Aviv',               rating: 4.0 },
    ],
  },

  quality: {
    venue: [
      { name: 'Boutique Conference Hall', unitPrice: 7500,  supplier: 'Sarona Meet & Work',        location: 'Sarona Market, Tel Aviv', rating: 4.4 },
      { name: 'Modern Urban Loft',        unitPrice: 9000,  supplier: 'The Urban Loft TLV',        location: 'Florentin, Tel Aviv',     rating: 4.7 },
      { name: 'Rothschild Lounge',        unitPrice: 6500,  supplier: 'Mindspace Innovation Hub',  location: 'Rothschild Blvd, Tel Aviv', rating: 4.5 },
    ],
    catering: [
      { name: 'Mediterranean Fusion Buffet',    unitPrice: 90,  supplier: 'Florentin Artisanal Kitchen', location: 'Florentin, Tel Aviv',     rating: 4.5 },
      { name: 'Corporate Cocktail & Tapas',     unitPrice: 110, supplier: 'Rothschild Bistro Catering', location: 'Rothschild Blvd, Tel Aviv', rating: 4.7 },
      { name: 'Gourmet Grab-and-Go Stations',   unitPrice: 80,  supplier: 'Shuk Bites Catering',         location: 'Levinsky Market, Tel Aviv', rating: 4.6 },
    ],
    decor: [
      { name: 'Corporate Branding Arch',         unitPrice: 2500, supplier: 'BalloonArt Tel Aviv',  location: 'Tel Aviv-Yafo',           rating: 4.6 },
      { name: 'Themed Environment Setup',        unitPrice: 4000, supplier: 'DesignLab Event Decor',location: 'Herzliya',                rating: 4.8 },
      { name: 'Ambient Lighting & Centerpieces', unitPrice: 3000, supplier: 'Light & Bloom TLV',    location: 'Tel Aviv',                rating: 4.5 },
    ],
    entertainment: [
      { name: 'Premium Lounge DJ Set',           unitPrice: 3000, supplier: 'Alpha Beats Agency',   location: 'Rothschild Blvd, Tel Aviv', rating: 4.9 },
      { name: 'Live Jazz Quartet',               unitPrice: 4000, supplier: 'Jazz Tel Aviv',         location: 'Tel Aviv',                  rating: 4.6 },
      { name: 'Corporate Entertainment Package', unitPrice: 3500, supplier: 'Stage Pro IL',          location: 'Tel Aviv',                  rating: 4.5 },
    ],
    photography: [
      { name: 'Full-Day Event Photography', unitPrice: 3500, supplier: 'Lior Katz Photography',     location: 'Tel Aviv',               rating: 4.6 },
      { name: 'Photo & Video Bundle',       unitPrice: 4000, supplier: 'Tel Aviv Media Co.',         location: 'Tel Aviv',               rating: 4.5 },
      { name: 'Professional Photo Session', unitPrice: 2800, supplier: 'Studio Moment TLV',          location: 'Tel Aviv',               rating: 4.4 },
    ],
    'furniture & rentals': [
      { name: 'Elegant Banquet Furniture', unitPrice: 20, supplier: 'Premium Event Rentals',        location: 'Tel Aviv',               rating: 4.4 },
      { name: 'Modern Lounge Setup',       unitPrice: 25, supplier: 'Chic Rentals TLV',             location: 'Tel Aviv',               rating: 4.5 },
    ],
    staffing: [
      { name: 'Trained Event Staff',    unitPrice: 200, supplier: 'Elite Event Staff',              location: 'Tel Aviv',               rating: 4.6 },
      { name: 'Professional Waitstaff', unitPrice: 180, supplier: 'Pro Hospitality IL',             location: 'Tel Aviv',               rating: 4.5 },
    ],
    beverages: [
      { name: 'Standard Open Bar',   unitPrice: 35, supplier: 'Mixology TLV Bar Services',         location: 'Tel Aviv',               rating: 4.9 },
      { name: 'Beer & Wine Package', unitPrice: 25, supplier: 'Cheers Events TLV',                 location: 'Tel Aviv',               rating: 4.5 },
    ],
    favors: [
      { name: 'Custom Branded Gifts',  unitPrice: 20, supplier: 'Custom Gifting TLV',              location: 'Tel Aviv',               rating: 4.5 },
      { name: 'Artisan Sweet Platter', unitPrice: 15, supplier: 'Jaffa Artisan Bakery',            location: 'Jaffa',                  rating: 4.7 },
    ],
    'audio & visual': [
      { name: 'Ambient Lighting & Projector', unitPrice: 3000, supplier: 'PixelLight TLV',         location: 'Tel Aviv',               rating: 4.6 },
      { name: 'Compact AV Package',           unitPrice: 2500, supplier: 'Sonic Tech Audio Staging',location: 'Tel Aviv-Yafo',          rating: 4.8 },
    ],
    other: [
      { name: 'Premium Event Services', unitPrice: 200, supplier: 'Prestige Event Solutions',      location: 'Tel Aviv',               rating: 4.4 },
    ],
  },

  budget: {
    venue: [
      { name: 'Rooftop Event Deck',      unitPrice: 18000, supplier: 'The Skyline Terrace',        location: 'Azrieli Towers, Tel Aviv', rating: 4.6 },
      { name: 'Grand Glass Hangar',      unitPrice: 25000, supplier: 'Portside Spaces (Namal)',    location: 'Tel Aviv Port (Namal)',     rating: 4.9 },
      { name: 'Premium Exhibition Hall', unitPrice: 20000, supplier: 'The East Gallery',           location: 'Yad Eliyahu, Tel Aviv',    rating: 4.8 },
    ],
    catering: [
      { name: 'Premium Plated Gala Menu',  unitPrice: 200, supplier: 'Levant Fine Dining',         location: 'Neve Tzedek, Tel Aviv',  rating: 4.9 },
      { name: 'Live Sushi Boat Station',   unitPrice: 160, supplier: 'Samurai Sushi Catering',     location: 'Ramat HaChayal',         rating: 4.9 },
      { name: 'Chef-Driven Tasting Menu',  unitPrice: 220, supplier: 'Michelin-Grade Events IL',   location: 'Tel Aviv',               rating: 4.8 },
    ],
    decor: [
      { name: 'Elegant Gala Floral Archways',  unitPrice: 8000,  supplier: 'DesignLab Luxury',    location: 'Herzliya',               rating: 4.9 },
      { name: 'Full Venue Transformation',     unitPrice: 10000, supplier: 'Premier Decor IL',     location: 'Tel Aviv',               rating: 4.8 },
      { name: 'Luxury Floral & Draping Suite', unitPrice: 9000,  supplier: 'Bloom & Glow TLV',    location: 'Tel Aviv',               rating: 4.7 },
    ],
    entertainment: [
      { name: 'High-Energy Afterparty DJ', unitPrice: 6000,  supplier: 'Alpha Beats Premium',     location: 'Rothschild Blvd, Tel Aviv', rating: 4.9 },
      { name: 'Full Live Band (5 pieces)', unitPrice: 8000,  supplier: 'Premier Live Music IL',   location: 'Tel Aviv',                  rating: 4.8 },
      { name: 'Celebrity Performer Night', unitPrice: 12000, supplier: 'Elite Talent Agency IL',  location: 'Tel Aviv',                  rating: 4.9 },
    ],
    photography: [
      { name: 'Premium Photo & Cinema Package', unitPrice: 7000, supplier: 'Prestige Media TLV',  location: 'Tel Aviv',               rating: 4.8 },
      { name: 'Full Production Coverage',       unitPrice: 9000, supplier: 'Elite Visuals IL',     location: 'Tel Aviv',               rating: 4.9 },
      { name: 'Cinematic Event Film',           unitPrice: 8000, supplier: 'Art House Films TLV',  location: 'Tel Aviv',               rating: 4.7 },
    ],
    'furniture & rentals': [
      { name: 'Luxury Chiavari Chairs & Tables', unitPrice: 55, supplier: 'Luxury Event Furnishings', location: 'Tel Aviv',            rating: 4.7 },
      { name: 'VIP Lounge Collection',           unitPrice: 65, supplier: 'Prestige Rentals IL',      location: 'Tel Aviv',            rating: 4.8 },
    ],
    staffing: [
      { name: 'White Glove Waitstaff', unitPrice: 350, supplier: 'White Glove Event Services',    location: 'Tel Aviv',               rating: 4.8 },
      { name: 'Concierge Event Team',  unitPrice: 400, supplier: 'Premier Staff IL',               location: 'Tel Aviv',               rating: 4.8 },
    ],
    beverages: [
      { name: 'Premium Cocktail Experience', unitPrice: 80, supplier: 'Mixology TLV Premium',     location: 'Tel Aviv',               rating: 4.9 },
      { name: 'VIP Open Bar & Sommelier',    unitPrice: 95, supplier: 'Elite Bar Services IL',     location: 'Tel Aviv',               rating: 4.8 },
    ],
    favors: [
      { name: 'Luxury Personalized Gift Box', unitPrice: 60, supplier: 'Exclusive Event Gifts',   location: 'Tel Aviv',               rating: 4.7 },
      { name: 'Premium Branded Hamper',       unitPrice: 80, supplier: 'Prestige Gifting IL',      location: 'Tel Aviv',               rating: 4.8 },
    ],
    'audio & visual': [
      { name: 'Full Keynote Production Rig',  unitPrice: 8000, supplier: 'Full Scale Production TLV', location: 'Tel Aviv-Yafo',      rating: 4.9 },
      { name: 'Premium Stage & Sound System', unitPrice: 7000, supplier: 'Prestige AV Productions',   location: 'Tel Aviv',           rating: 4.8 },
    ],
    other: [
      { name: 'Elite Concierge Services', unitPrice: 500, supplier: 'Elite Concierge Events',     location: 'Tel Aviv',               rating: 4.7 },
    ],
  },
};

// Categories that can be dropped from the Essential bundle when budget is tight
// (venue and catering are always kept as the core event requirements).
const OPTIONAL_CATEGORIES = new Set([
  'entertainment', 'photography', 'audio & visual', 'favors',
  'staffing', 'furniture & rentals', 'beverages', 'decor', 'other',
]);

function pickOption(tierCatalog, rawCategory, idx) {
  const key = rawCategory.toLowerCase().trim();
  const options = tierCatalog[key] ?? tierCatalog.other;
  return options[idx % options.length];
}

function makeSupplier(label, idx, option) {
  return {
    id:       `${label}-${idx + 1}`,
    name:     option.supplier,
    location: option.location,
    contact:  `events@${option.supplier.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.il`,
    rating:   round2(option.rating + (Math.random() * 0.2 - 0.1)),
  };
}

const TIER_TARGET = { economical: 0.65, quality: 0.95, budget: 1.55 };

function buildTier(label, items, budget) {
  const tierCatalog = CATALOG[label];
  const target = budget * TIER_TARGET[label];

  // Price every item using this tier's catalog options.
  let priced = items.map((item, idx) => {
    const option = pickOption(tierCatalog, item.category, idx);
    const jitter = 0.92 + Math.random() * 0.16; // ±8 % natural variance
    const unitPrice = round2(option.unitPrice * jitter);
    return {
      category:   item.category,
      name:       option.name,
      quantity:   item.quantity,
      unit:       item.unit ?? 'item',
      unitPrice,
      totalPrice: round2(unitPrice * item.quantity),
      supplier:   makeSupplier(label, idx, option),
    };
  });

  // Luxe tier: show full unscaled premium prices — intentionally over budget.
  if (label === 'budget') {
    const totalPrice = round2(priced.reduce((s, it) => s + it.totalPrice, 0));
    const avgRating  = priced.length
      ? round2(priced.reduce((s, it) => s + it.supplier.rating, 0) / priced.length)
      : null;
    return { label, items: priced, totalPrice, averageRating: avgRating, fitsBudget: totalPrice <= budget };
  }

  let total = round2(priced.reduce((s, it) => s + it.totalPrice, 0));

  // For the Essential tier: if way over budget, drop the most expensive optional
  // categories first ("scrappy" approach). This produces a leaner but realistic
  // bundle instead of scaling every line item down to micro-amounts.
  if (label === 'economical' && total > target * 1.4 && priced.length > 2) {
    const sorted  = [...priced].sort((a, b) => b.totalPrice - a.totalPrice);
    let working   = [...priced];
    for (const expensive of sorted) {
      if (working.length <= 2) break;
      if (working.reduce((s, it) => s + it.totalPrice, 0) <= target * 1.2) break;
      if (OPTIONAL_CATEGORIES.has(expensive.category.toLowerCase().trim())) {
        working = working.filter((it) => it !== expensive);
      }
    }
    priced = working;
    total  = round2(priced.reduce((s, it) => s + it.totalPrice, 0));
  }

  // Scale remaining items proportionally to land on the target spend.
  if (total > target) {
    const scale = target / total;
    priced = priced.map((item) => {
      const up = Math.max(round2(item.unitPrice * scale), 0.01); // never true-zero
      return { ...item, unitPrice: up, totalPrice: round2(up * item.quantity) };
    });
    total = round2(priced.reduce((s, it) => s + it.totalPrice, 0));
  }

  // Fallback: guarantee at least one item even if the input was somehow empty.
  if (priced.length === 0) {
    const fallback = tierCatalog.other[0];
    const fp = round2(Math.min(fallback.unitPrice, Math.max(budget * 0.3, 1)));
    priced = [{
      category:   'Other',
      name:       fallback.name,
      quantity:   1,
      unit:       'package',
      unitPrice:  fp,
      totalPrice: fp,
      supplier:   makeSupplier(label, 0, fallback),
    }];
    total = fp;
  }

  const totalPrice = round2(total);
  const avgRating  = round2(priced.reduce((s, it) => s + it.supplier.rating, 0) / priced.length);
  return {
    label,
    items:         priced,
    totalPrice,
    averageRating: avgRating,
    fitsBudget:    totalPrice <= budget,
  };
}

/**
 * Build three mock event bundles from the agent's structured plan.
 *
 * @param {{ eventType: string, guests: number, budget: number,
 *           items: Array<{category, name?, quantity, unit?}> }} input
 * @returns {{ eventType, guests, budget, bundles: Array }}
 */
function buildBundles({ eventType, guests, budget, items }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('items must be a non-empty array');
  }
  if (!Number.isFinite(budget) || budget <= 0) {
    throw new Error('budget must be a positive number');
  }

  return {
    eventType,
    guests,
    budget,
    bundles: [
      buildTier('economical', items, budget),
      buildTier('quality',    items, budget),
      buildTier('budget',     items, budget),
    ],
  };
}

module.exports = { buildBundles };
