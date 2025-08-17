import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const run = async () => {
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const cat1 = await prisma.category.create({
    data: { title: 'Вибропогружатели', slug: 'vibropogruzhateli' }
  });
  const cat2 = await prisma.category.create({
    data: { title: 'Гидромолоты', slug: 'gidromoloty' }
  });

  const p1 = await prisma.product.create({
    data: {
      title: 'Вибропогружатель X100',
      slug: 'vibro-x100',
      description: 'Мощный и надежный.',
      price: 25990000,
      categoryId: cat1.id
    }
  });

  await prisma.productImage.createMany({
    data: [
      { url: 'https://picsum.photos/seed/x100/800/600', alt: 'X100', productId: p1.id }
    ]
  });

  await prisma.product.create({
    data: {
      title: 'Гидромолот H-25',
      slug: 'hammer-h25',
      description: 'Для сложных работ.',
      price: 18990000,
      categoryId: cat2.id
    }
  });

  console.log('Seed done');
};

run().finally(() => prisma.$disconnect());
