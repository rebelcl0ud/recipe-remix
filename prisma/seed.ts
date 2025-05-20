import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.recipeIngredient.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();

  // Create shared ingredients
  const [flour, sugar, eggs, butter, salt, milk] = await Promise.all([
    prisma.ingredient.create({ data: { name: "Flour" } }),
    prisma.ingredient.create({ data: { name: "Sugar" } }),
    prisma.ingredient.create({ data: { name: "Eggs" } }),
    prisma.ingredient.create({ data: { name: "Butter" } }),
    prisma.ingredient.create({ data: { name: "Salt" } }),
    prisma.ingredient.create({ data: { name: "Milk" } }),
  ]);

  // Create users with recipes
  const user1 = await prisma.user.create({
    data: {
      email: "luchi@example.com",
      name: "Luchi",
      recipes: {
        create: [
          {
            title: "Pancakes",
            content: "Fluffy and golden brown.",
            published: true,
            ingredients: {
              create: [
                { ingredientId: flour.id, amount: "2 cups" },
                { ingredientId: eggs.id, amount: "2" },
                { ingredientId: milk.id, amount: "1 cup" },
              ],
            },
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "katella@example.com",
      name: "Kat",
      recipes: {
        create: [
          {
            title: "Cookies",
            content: "Crunchy and sweet.",
            published: true,
            ingredients: {
              create: [
                { ingredientId: flour.id, amount: "2.5 cups" },
                { ingredientId: sugar.id, amount: "1 cup" },
                { ingredientId: butter.id, amount: "0.5 cup" },
              ],
            },
          },
        ],
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "detra@example.com",
      name: "D",
      recipes: {
        create: [
          {
            title: "Scrambled Eggs",
            content: "Simple and quick breakfast.",
            published: false,
            ingredients: {
              create: [
                { ingredientId: eggs.id, amount: "3" },
                { ingredientId: salt.id, amount: "1 tsp" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("🌱 Seed complete.");
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
