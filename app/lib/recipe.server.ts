import { prisma } from "./prisma.server";

export async function createRecipe(
  title: string,
  content: string,
  ingredients: { name: string; amount: string }[],
  published: boolean,
  authorId: number,
) {
  return prisma.recipe.create({
    data: {
      title,
      content,
      ingredients: {
        create: ingredients.map(({ name, amount }) => ({
          amount,
          ingredient: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
      published,
      authorId,
    },
  });
}

export async function deleteRecipe(recipeId: number) {
  return prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: { deletedAt: new Date() },
  });
}
