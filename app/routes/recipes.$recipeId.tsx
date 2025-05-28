import { useLoaderData } from "@remix-run/react";
import { prisma } from "../lib/prisma.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.recipeId);

  if (isNaN(id)) throw new Response("Invalid Recipe ID", { status: 400 });

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: {
      title: true,
      content: true,
      ingredients: {
        select: {
          id: true,
          amount: true,
          ingredient: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!recipe) throw new Response("No Recipe found", { status: 404 });

  return { recipe };
}

export default function RecipeId() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="bg-[var(--color-antiquewhite)] p-4 rounded-xl h-[400px]">
      <h1 className="font-bold">{data.recipe?.title}</h1>
      <p className="italic">{data.recipe?.content}</p>
      <ul className="m-4">
        {data.recipe.ingredients.map((i) => (
          <li className="list-disc" key={i.id}>
            {i.amount} {i.ingredient.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
