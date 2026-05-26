import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const workTypes = [
  { name: 'Кладка перегородок', unit: 'м²' },
  { name: 'Монтаж опалубки', unit: 'м²' },
  { name: 'Бетонирование', unit: 'м³' },
  { name: 'Арматурные работы', unit: 'т' },
  { name: 'Штукатурка стен', unit: 'м²' },
  { name: 'Малярные работы', unit: 'м²' },
  { name: 'Укладка плитки', unit: 'м²' },
  { name: 'Монтаж перекрытий', unit: 'шт' },
];

async function main() {
  console.log('Start seeding...');
  for (const workType of workTypes) {
    await prisma.workType.upsert({
      where: { name: workType.name },
      update: {},
      create: workType,
    });
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
