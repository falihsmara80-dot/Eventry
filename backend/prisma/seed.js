require('dotenv').config({ quiet: true });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SUPPLIERS = [
  {
    name: 'Carmel Catering Co.',
    location: 'Florentin, Tel Aviv',
    contact: 'hello@carmelcatering.co.il',
    products: [
      { name: 'Buffet-Style Dinner Catering', category: 'Catering', price: 18.0 },
      { name: 'Cocktail Hour Appetizer Platter', category: 'Catering', price: 12.0 },
      { name: 'Custom Party Favor Boxes', category: 'Favors', price: 5.0 },
    ],
  },
  {
    name: 'TLV Sound & Lights',
    location: 'Rothschild Blvd, Tel Aviv',
    contact: 'book@tlvsoundlights.com',
    products: [
      { name: 'Professional DJ & Entertainment Set', category: 'Entertainment', price: 250.0 },
      { name: 'Premium Sound & Lighting Rig', category: 'Audio & Visual', price: 200.0 },
    ],
  },
  {
    name: 'Levinsky Decor Studio',
    location: 'Levinsky Market, Tel Aviv',
    contact: 'studio@levinskydecor.il',
    products: [
      { name: 'Themed Decor & Styling Package', category: 'Decor', price: 8.0 },
      { name: 'Lounge Furniture & Rental Set', category: 'Furniture & Rentals', price: 12.0 },
    ],
  },
  {
    name: 'Blue Bar Beverages',
    location: 'Neve Tzedek, Tel Aviv',
    contact: 'orders@bluebartlv.com',
    products: [
      { name: 'Open Bar & Beverage Package', category: 'Beverages', price: 6.0 },
      { name: 'Mocktail & Soft Drink Station', category: 'Beverages', price: 4.5 },
    ],
  },
  {
    name: 'Jaffa Events Co.',
    location: 'Jaffa Port, Tel Aviv',
    contact: 'info@jaffaevents.co.il',
    products: [
      { name: 'Rooftop Venue Rental', category: 'Venue', price: 500.0 },
      { name: 'Event Photography Package', category: 'Photography', price: 300.0 },
      { name: 'On-Site Event Staffing', category: 'Staffing', price: 100.0 },
      { name: 'Miscellaneous Event Add-ons', category: 'Other', price: 50.0 },
    ],
  },
];

async function main() {
  console.log('Seeding database with Tel Aviv suppliers...');

  // Clear existing data (order matters because of foreign keys).
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();

  for (const supplier of SUPPLIERS) {
    const created = await prisma.supplier.create({
      data: {
        name: supplier.name,
        location: supplier.location,
        contact: supplier.contact,
        products: {
          create: supplier.products,
        },
      },
      include: { products: true },
    });
    console.log(`  Created ${created.name} with ${created.products.length} product(s)`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
