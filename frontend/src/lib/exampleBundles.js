// PREVIEW ONLY — NOT the live algorithm.
//
// A static sample of the bundle-selection algorithm's output shape, used purely
// to style/preview the BundleComparison UI before the algorithm team's real
// implementation (backend/src/services/bundleSelector.js) is wired in. This is
// never fetched from or returned by the live /api/agent/plan path.
//
// Shape mirrors the real algorithm: rating lives INSIDE supplier, and
// averageRating may be null when no supplier in a bundle is rated.
const sup = (name, location, rating) => ({ id: 0, name, location, contact: '', rating })

export const EXAMPLE_RESULT = {
  eventType: 'Wedding',
  guests: 120,
  budget: 25000,
  bundles: [
    {
      label: 'economical',
      totalPrice: 18650.0,
      averageRating: 4.3,
      fitsBudget: true,
      items: [
        { category: 'Venue', name: 'Garden hall (half-day)', quantity: 1, unit: 'package', unitPrice: 4200, totalPrice: 4200, supplier: sup('Rosewood Estates', 'Austin, TX', 4.4) },
        { category: 'Catering', name: 'Buffet dinner', quantity: 120, unit: 'guest', unitPrice: 42, totalPrice: 5040, supplier: sup('Fork & Flame', 'Austin, TX', 4.2) },
        { category: 'Photography', name: 'Standard coverage (6h)', quantity: 1, unit: 'package', unitPrice: 1800, totalPrice: 1800, supplier: sup('Lumen Studio', 'Round Rock, TX', 4.5) },
        { category: 'Decor', name: 'Floral & table styling', quantity: 12, unit: 'table', unitPrice: 140, totalPrice: 1680, supplier: sup('Petal Co.', 'Austin, TX', 4.1) },
        { category: 'Beverages', name: 'Open soft bar', quantity: 120, unit: 'guest', unitPrice: 18, totalPrice: 2160, supplier: sup('Pour House', 'Austin, TX', 4.0) },
        { category: 'Entertainment', name: 'DJ (5h)', quantity: 1, unit: 'package', unitPrice: 1200, totalPrice: 1200, supplier: sup('BeatLab', 'Austin, TX', 4.6) },
      ],
    },
    {
      label: 'quality',
      totalPrice: 24300.0,
      averageRating: 4.8,
      fitsBudget: true,
      items: [
        { category: 'Venue', name: 'Lakeside manor (full-day)', quantity: 1, unit: 'package', unitPrice: 6800, totalPrice: 6800, supplier: sup('Lakeview Manor', 'Austin, TX', 4.9) },
        { category: 'Catering', name: 'Plated 3-course dinner', quantity: 120, unit: 'guest', unitPrice: 72, totalPrice: 8640, supplier: sup('Saffron Table', 'Austin, TX', 4.8) },
        { category: 'Photography', name: 'Premium coverage + video', quantity: 1, unit: 'package', unitPrice: 3200, totalPrice: 3200, supplier: sup('Lumen Studio', 'Round Rock, TX', 4.9) },
        { category: 'Decor', name: 'Designer floral installation', quantity: 12, unit: 'table', unitPrice: 260, totalPrice: 3120, supplier: sup('Bloomwork', 'Austin, TX', 4.7) },
        { category: 'Entertainment', name: 'Live band (4h)', quantity: 1, unit: 'package', unitPrice: 2540, totalPrice: 2540, supplier: sup('The Velvet Set', 'Austin, TX', 4.8) },
      ],
    },
    {
      label: 'budget',
      totalPrice: 14200.0,
      averageRating: 4.0,
      fitsBudget: true,
      items: [
        { category: 'Venue', name: 'Community loft', quantity: 1, unit: 'package', unitPrice: 2600, totalPrice: 2600, supplier: sup('The Loft 6th', 'Austin, TX', 3.9) },
        { category: 'Catering', name: 'Family-style stations', quantity: 120, unit: 'guest', unitPrice: 33, totalPrice: 3960, supplier: sup('Fork & Flame', 'Austin, TX', 4.0) },
        { category: 'Photography', name: 'Essentials (4h)', quantity: 1, unit: 'package', unitPrice: 1100, totalPrice: 1100, supplier: sup('SnapWorks', 'Austin, TX', 4.1) },
        { category: 'Decor', name: 'Core table styling', quantity: 12, unit: 'table', unitPrice: 90, totalPrice: 1080, supplier: sup('Petal Co.', 'Austin, TX', 3.8) },
        { category: 'Beverages', name: 'Soft bar', quantity: 120, unit: 'guest', unitPrice: 12, totalPrice: 1440, supplier: sup('Pour House', 'Austin, TX', 3.9) },
        { category: 'Entertainment', name: 'DJ (4h)', quantity: 1, unit: 'package', unitPrice: 900, totalPrice: 900, supplier: sup('BeatLab', 'Austin, TX', 4.2) },
      ],
    },
  ],
}
