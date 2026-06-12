const prisma = require('../lib/prisma');

// Groups all products (with their supplier) by lowercase category for fast lookup.
async function loadProductsByCategory() {
  const products = await prisma.product.findMany({ include: { supplier: true } });

  const byCategory = new Map();
  for (const product of products) {
    const key = product.category.toLowerCase().trim();
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(product);
  }
  return byCategory;
}

// Attaches a matched local supplier to each bundle item based on category.
// Falls back to "other" category suppliers if no exact category match exists.
async function matchSuppliers(items) {
  const byCategory = await loadProductsByCategory();

  return items.map((item) => {
    const key = item.category.toLowerCase().trim();
    const candidates = byCategory.get(key) ?? byCategory.get('other') ?? [];

    if (candidates.length === 0) {
      return { ...item, supplier: null };
    }

    const product = candidates[Math.floor(Math.random() * candidates.length)];

    return {
      ...item,
      supplier: {
        id: product.supplier.id,
        name: product.supplier.name,
        location: product.supplier.location,
        contact: product.supplier.contact,
        matchedProduct: product.name,
      },
    };
  });
}

module.exports = { matchSuppliers };
