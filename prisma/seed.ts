
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const placeholderImage = (width: number, height: number) => `https://placehold.co/${width}x${height}.png`;

async function main() {
  console.log('Start seeding ...');

  // Seed Categories
  const freshVeggies = await prisma.category.upsert({
    where: { name: 'Fresh Veggies' },
    update: {},
    create: {
      name: 'Fresh Veggies',
      imageUrl: placeholderImage(200,150),
    },
  });

  const leafyGreens = await prisma.category.upsert({
    where: { name: 'Leafy Greens' },
    update: {},
    create: {
      name: 'Leafy Greens',
      imageUrl: placeholderImage(200,150),
    },
  });

  const rootVegetables = await prisma.category.upsert({
    where: { name: 'Root Vegetables' },
    update: {},
    create: {
      name: 'Root Vegetables',
      imageUrl: placeholderImage(200,150),
    },
  });

  const fruitsCategory = await prisma.category.upsert({ // Renamed to avoid conflict with 'Fruits' table if any
    where: { name: 'Fruits' },
    update: {},
    create: {
      name: 'Fruits',
      imageUrl: placeholderImage(200,150),
    },
  });
  
  console.log('Categories seeded.');

  // Seed Products
  const productsData: Prisma.ProductCreateInput[] = [
    {
      name: 'Organic Potato',
      description: 'Fresh and starchy, perfect for roasting or mashing. Grown organically. 1kg pack.',
      price: 2.99,
      stock: 150,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'potato organic',
    },
    {
      name: 'Red Onion',
      description: 'Crisp and flavorful red onions, great for salads and cooking. Approx 500g.',
      price: 1.75,
      stock: 200,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'red onion',
    },
    {
      name: 'Sweet Carrots',
      description: 'Crunchy and sweet carrots, ideal for snacking or adding to stews. Bunch.',
      price: 2.20,
      stock: 120,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: rootVegetables.id } },
      dataAiHint: 'carrots bunch',
    },
    {
      name: 'Fresh Spinach',
      description: 'Tender baby spinach leaves, washed and ready to eat. 200g bag.',
      price: 3.50,
      stock: 80,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: leafyGreens.id } },
      dataAiHint: 'spinach leaves',
    },
    {
      name: 'Vine Tomatoes',
      description: 'Ripe and juicy tomatoes on the vine, bursting with flavor. Approx 450g.',
      price: 3.10,
      stock: 90,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: fruitsCategory.id } }, // Tomatoes are botanically fruits
      dataAiHint: 'tomatoes vine',
    },
    {
      name: 'Broccoli Florets',
      description: 'Fresh broccoli florets, perfect for steaming or stir-frying. 300g pack.',
      price: 2.80,
      stock: 110,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'broccoli florets',
    },
    {
      name: 'Romaine Lettuce',
      description: 'Crisp Romaine lettuce hearts, great for Caesar salads. Twin pack.',
      price: 2.90,
      stock: 70,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: leafyGreens.id } },
      dataAiHint: 'romaine lettuce',
    },
    {
      name: 'Bell Pepper Trio',
      description: 'A mix of red, yellow, and green bell peppers. Sweet and crunchy. 3 pack.',
      price: 4.50,
      stock: 60,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'bell peppers',
    },
     {
      name: 'Cucumber',
      description: 'Cool and crisp cucumber, perfect for salads and sandwiches. Single.',
      price: 1.20,
      stock: 130,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'cucumber fresh',
    },
    {
      name: 'Zucchini',
      description: 'Versatile zucchini, great for grilling, roasting, or spiralizing. Single.',
      price: 1.90,
      stock: 100,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'zucchini green',
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { name: p.name }, // Assuming product names are unique for upsert
      update: p, // Update with new data if it exists
      create: p,
    });
  }
  console.log('Products seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
