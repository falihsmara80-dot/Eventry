const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Clearing old data for a fresh demo slate...");
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();

  console.log("Seeding comprehensive Corporate Event options for Tel Aviv... 🇮🇱");

  // 1. VENUES
  await prisma.supplier.create({
    data: {
      name: "The Urban Loft TLV",
      location: "Florentin, South Tel Aviv",
      contact: "booking@urbanloft.co.il",
      rating: 4.7,
      description: "A renovated industrial warehouse space in South Tel Aviv. Features exposed brick, exceptional high-speed fiber internet, and modular layouts.",
      products: {
        create: [{
          name: "Main Industrial Floor",
          price: 18000.00,
          category: "VENUE",
          maxCapacity: 350,
          supportedEvents: ["corporate"],
          tags: ["industrial", "tech", "casual", "edgy"],
          description: "Spacious main floor equipped with high-density Wi-Fi networks and multi-projection walls. Perfect for hackathons or developer meetups."
        }]
      }
    }
  });

  await prisma.supplier.create({
    data: {
      name: "Sarona Meet & Work",
      location: "Sarona Market, Tel Aviv",
      contact: "events@sarona-meet.co.il",
      rating: 4.4,
      description: "Modern, brightly lit urban space designed specifically for team-building days, workshops, and small company gatherings.",
      products: {
        create: [{
          name: "The Assembly Hall",
          price: 14000.00,
          category: "VENUE",
          maxCapacity: 150,
          supportedEvents: ["corporate"],
          tags: ["modern", "bright", "casual", "workshop"],
          description: "An open-plan layout featuring comfortable seating, portable monitor displays, and dedicated breakout rooms."
        }]
      }
    }
  });

  await prisma.supplier.create({
    data: {
      name: "Mindspace Innovation Hub",
      location: "Rothschild Blvd, Tel Aviv",
      contact: "hubs@mindspace.com",
      rating: 4.5,
      description: "A sleek, highly professional enterprise environment tailored for the modern corporate ecosystem.",
      products: {
        create: [{
          name: "The Rothschild Lounge",
          price: 12000.00,
          category: "VENUE",
          maxCapacity: 120,
          supportedEvents: ["corporate"],
          tags: ["professional", "modern", "networking"],
          description: "An elegant, ready-to-go presentation lounge featuring built-in video-conferencing, whiteboard partitions, and a reception desk."
        }]
      }
    }
  });

  await prisma.supplier.create({
    data: {
      name: "The Skyline Terrace",
      location: "Azrieli Towers, Tel Aviv",
      contact: "info@skyline-events.co.il",
      rating: 4.6,
      description: "A stunning rooftop venue offering panoramic views across the entire Tel Aviv skyline.",
      products: {
        create: [{
          name: "Rooftop Event Deck",
          price: 28000.00,
          category: "VENUE",
          maxCapacity: 250,
          supportedEvents: ["corporate"],
          tags: ["skyline", "modern", "outdoor", "networking"],
          description: "High-altitude deck featuring lounge seating, an integrated outdoor bar, and glass wind protection shields."
        }]
      }
    }
  });

  await prisma.supplier.create({
    data: {
      name: "Portside Spaces (Namal)",
      location: "Tel Aviv Port (Namal)",
      contact: "events@portside-tlv.co.il",
      rating: 4.9,
      description: "Ultra-premium waterfront production space sitting directly on the open Mediterranean boardwalk.",
      products: {
        create: [{
          name: "The Grand Glass Hangar",
          price: 45000.00,
          category: "VENUE",
          maxCapacity: 800,
          supportedEvents: ["corporate"],
          tags: ["luxury", "modern", "sea-view", "formal"],
          description: "A magnificent structural venue with floor-to-ceiling glass paneling overlooking the sea. Designed for scale and prestige."
        }]
      }
    }
  });

  await prisma.supplier.create({
    data: {
      name: "The East Gallery",
      location: "Yad Eliyahu, Tel Aviv",
      contact: "events@the-east.co.il",
      rating: 4.8,
      description: "An upscale architectural masterpiece blending historical stone surfaces with high-end modern design accents.",
      products: {
        create: [{
          name: "Premium Exhibition Hall",
          price: 38000.00,
          category: "VENUE",
          maxCapacity: 500,
          supportedEvents: ["corporate"],
          tags: ["luxury", "artistic", "indoor", "formal"],
          description: "A sophisticated climate-controlled hall with custom interior accent lighting and dynamic acoustics. Perfect for year-end galas."
        }]
      }
    }
  });

  // 2. CATERING
  await prisma.supplier.create({
    data: {
      name: "Shuk Bites Catering",
      location: "Levinsky Market, Tel Aviv",
      contact: "orders@shukbites.co.il",
      rating: 4.6,
      description: "Street-food style catering presenting casual, fast-paced dining experiences inspired by Tel Aviv's open markets.",
      products: {
        create: [{
          name: "Grab-and-Go Food Truck Stations",
          price: 180.00,
          category: "CATERING",
          maxCapacity: 400,
          supportedEvents: ["corporate"],
          tags: ["casual", "street-food", "interactive"],
          description: "Flowing slider, taco, and bao bun stations. Keeps energy levels up without interrupting active workflows or coding sessions."
        }]
      }
    }
  });

  await prisma.supplier.create({
    data: {
      name: "Rothschild Bistro Catering",
      location: "Rothschild Blvd, Tel Aviv",
      contact: "bistro@rothschild-events.co.il",
      rating: 4.7,
      description: "Premium office and seminar catering offering upscale buffet spreads and artisanal finger food options.",
      products: {
        create: [{
          name: "Corporate Cocktail & Tapas Menu",
          price: 290.00,
          category: "CATERING",
          maxCapacity: 300,
          supportedEvents: ["corporate"],
          tags: ["cocktail", "networking", "elegant"],
          description: "Sophisticated hot and cold appetizers passed by waiters, accompanied by micro-dessert bars. Designed for easy networking."
        }]
      }
    }
  });

  await prisma.supplier.create({
    data: {
      name: "Florentin Artisanal Kitchen",
      location: "Florentin, Tel Aviv",
      contact: "hello@florentinkitchen.co.il",
      rating: 4.5,
      description: "Contemporary buffet-style catering utilizing locally sourced seasonal ingredients.",
      products: {
        create: [{
          name: "Mediterranean Fusion Buffet",
          price: 240.00,
          category: "CATERING",
          maxCapacity: 500,
          supportedEvents: ["corporate"],
          tags: ["buffet", "casual", "fresh"],
          description: "A robust self-service buffet featuring slow-roasted meats, fresh levante salads, and roasted market root vegetables."
        }]
      }
    }
  });

  await prisma.supplier.create({
    data: {
      name: "Levant Fine Dining",
      location: "Neve Tzedek, Tel Aviv",
      contact: "chef@levant-culinary.co.il",
      rating: 4.9,
      description: "High-end, chef-driven culinary kitchen executing signature multi-course modern Mediterranean menus.",
      products: {
        create: [{
          name: "Premium Plated Gala Menu",
          price: 450.00,
          category: "CATERING",
          maxCapacity: 1000,
          supportedEvents: ["corporate"],
          tags: ["luxury", "formal", "gourmet", "plated"],
          description: "A structured, formal 3-course sit-down dinner showcasing premium local charcoal meats, raw fish crudo bars, and private wine lists."
        }]
      }
    }
  });

  // 3. PRODUCTION & AUDIO VISUAL
  await prisma.supplier.create({
    data: {
      name: "Sonic Tech Audio Staging",
      location: "Tel Aviv-Yafo",
      contact: "av@sonictech.co.il",
      rating: 4.8,
      description: "Full-service professional stage engineering, lighting infrastructure, and sound system supplier.",
      products: {
        create: [
          {
            name: "Compact Event Speaker Setup",
            price: 3500.00,
            category: "PRODUCTION",
            maxCapacity: null,
            supportedEvents: ["corporate"],
            tags: ["compact", "clear-vocal"],
            description: "Simple dual-speaker PA array with high-fidelity wireless vocal microphones and standard auxiliary connections."
          },
          {
            name: "Full Scale Keynote Production Rig",
            price: 15000.00,
            category: "PRODUCTION",
            maxCapacity: null,
            supportedEvents: ["corporate"],
            tags: ["staged", "broadcast-quality", "immersive"],
            description: "Concert-grade digital audio boards, line-array speakers, computerized stage lighting profiles, and direct multi-cam streaming pipelines."
          }
        ]
      }
    }
  });

  await prisma.supplier.create({
    data: {
      name: "PixelLight TLV",
      location: "Tel Aviv",
      contact: "crew@pixellight.co.il",
      rating: 4.6,
      description: "Mid-tier audio-visual team specializing in high-definition projection mapping and ambient venue lighting enhancements.",
      products: {
        create: [{
          name: "Ambient Lighting & Presentation Pack",
          price: 7500.00,
          category: "PRODUCTION",
          maxCapacity: null,
          supportedEvents: ["corporate"],
          tags: ["vibrant", "professional"],
          description: "Includes uplighting around the venue walls, a high-lumens focal projector, and a custom wireless clicker system."
        }]
      }
    }
  });

  // 4. MUSIC
  await prisma.supplier.create({
    data: {
      name: "Alpha Beats Agency",
      location: "Rothschild Blvd, Tel Aviv",
      contact: "bookings@alphabeats.co.il",
      rating: 4.9,
      description: "Exclusive talent management representing high-profile club DJs and corporate event performers in central Israel.",
      products: {
        create: [
          {
            name: "Premium Lounge DJ Set",
            price: 5500.00,
            category: "MUSIC",
            maxCapacity: null,
            supportedEvents: ["corporate"],
            tags: ["ambient", "house", "networking"],
            description: "A 4-hour background set blending chill house, downtempo, and lounge music. Ideal for corporate networking mixers."
          },
          {
            name: "High-Energy Afterparty Set",
            price: 9000.00,
            category: "MUSIC",
            maxCapacity: null,
            supportedEvents: ["corporate"],
            tags: ["energetic", "dance", "party"],
            description: "Full-scale club mixing with energetic transitions, top-40 hits, and electronic remixes. Designed to turn a company gala into an active dance floor."
          }
        ]
      }
    }
  });

  console.log("Tel Aviv database successfully seeded with a massive array of options! 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
