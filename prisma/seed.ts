
import { PrismaClient, Prisma, UserRole, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const placeholderImage = (width: number, height: number) => `https://placehold.co/${width}x${height}.png`;

async function main() {
  console.log('Start seeding ...');

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error('ADMIN_EMAIL environment variable is not set. Skipping admin user seeding.');
    // Optionally, throw an error if admin is critical for seeding other data
    // throw new Error("ADMIN_EMAIL must be set in .env for seeding.");
  }

  let adminUser: Prisma.UserGetPayload<{}> | null = null;

  if (adminEmail) {
    const hashedPassword = await bcrypt.hash('password123', 10); // Default password for admin
    adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        role: UserRole.ADMIN,
      },
      create: {
        email: adminEmail,
        name: 'Admin User',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
        emailVerified: new Date(), // Mark admin email as verified for simplicity
      },
    });
    console.log(`Admin user ${adminUser.name} seeded/updated with role ADMIN.`);
  }


  // Seed Categories
  const freshVeggies = await prisma.category.upsert({
    where: { name: 'Fresh Veggies' },
    update: {},
    create: {
      name: 'Fresh Veggies',
      imageUrl: placeholderImage(200,150),
      dataAiHint: "fresh vegetables"
    },
  });

  const leafyGreens = await prisma.category.upsert({
    where: { name: 'Leafy Greens' },
    update: {},
    create: {
      name: 'Leafy Greens',
      imageUrl: placeholderImage(200,150),
      dataAiHint: "leafy greens salad"
    },
  });

  const rootVegetables = await prisma.category.upsert({
    where: { name: 'Root Vegetables' },
    update: {},
    create: {
      name: 'Root Vegetables',
      imageUrl: placeholderImage(200,150),
      dataAiHint: "root vegetables carrots"
    },
  });

  const fruitsCategory = await prisma.category.upsert({ 
    where: { name: 'Fruits' },
    update: {},
    create: {
      name: 'Fruits',
      imageUrl: placeholderImage(200,150),
      dataAiHint: "assorted fruits"
    },
  });
  
  console.log('Categories seeded.');

  // Seed Products
  const productsData: Omit<Prisma.ProductCreateInput, 'vendor'>[] = [
    {
      name: 'Organic Potato',
      description: 'Fresh and starchy, perfect for roasting or mashing. Grown organically. 1kg pack.',
      price: 2.99,
      stock: 150,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'potato organic',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Red Onion',
      description: 'Crisp and flavorful red onions, great for salads and cooking. Approx 500g.',
      price: 1.75,
      stock: 200,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'red onion',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Sweet Carrots',
      description: 'Crunchy and sweet carrots, ideal for snacking or adding to stews. Bunch.',
      price: 2.20,
      stock: 120,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: rootVegetables.id } },
      dataAiHint: 'carrots bunch',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Fresh Spinach',
      description: 'Tender baby spinach leaves, washed and ready to eat. 200g bag.',
      price: 3.50,
      stock: 80,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: leafyGreens.id } },
      dataAiHint: 'spinach leaves',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Vine Tomatoes',
      description: 'Ripe and juicy tomatoes on the vine, bursting with flavor. Approx 450g.',
      price: 3.10,
      stock: 90,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: fruitsCategory.id } }, 
      dataAiHint: 'tomatoes vine',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Broccoli Florets',
      description: 'Fresh broccoli florets, perfect for steaming or stir-frying. 300g pack.',
      price: 2.80,
      stock: 110,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'broccoli florets',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Romaine Lettuce',
      description: 'Crisp Romaine lettuce hearts, great for Caesar salads. Twin pack.',
      price: 2.90,
      stock: 70,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: leafyGreens.id } },
      dataAiHint: 'romaine lettuce',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Bell Pepper Trio',
      description: 'A mix of red, yellow, and green bell peppers. Sweet and crunchy. 3 pack.',
      price: 4.50,
      stock: 60,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'bell peppers',
      status: ProductStatus.ACTIVE,
    },
     {
      name: 'Cucumber',
      description: 'Cool and crisp cucumber, perfect for salads and sandwiches. Single.',
      price: 1.20,
      stock: 130,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'cucumber fresh',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Zucchini',
      description: 'Versatile zucchini, great for grilling, roasting, or spiralizing. Single.',
      price: 1.90,
      stock: 100,
      imageUrl: placeholderImage(600,400),
      category: { connect: { id: freshVeggies.id } },
      dataAiHint: 'zucchini green',
      status: ProductStatus.ACTIVE,
    },
  ];

  for (const p of productsData) {
    const productCreateData: Prisma.ProductCreateInput = {
      ...p,
      vendor: adminUser ? { connect: { id: adminUser.id } } : undefined,
    };
    await prisma.product.upsert({
      where: { name: p.name }, 
      update: productCreateData,
      create: productCreateData,
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
