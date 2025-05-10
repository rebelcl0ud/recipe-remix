import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // queries here
  const userWithRecipes = await prisma.user.findMany({
    include: {
      recipes: true,
    },
  });
  console.dir(userWithRecipes, { depth: null });
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
