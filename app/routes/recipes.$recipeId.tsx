import { useLoaderData, useParams } from "@remix-run/react";
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
    },
  });

  if (!recipe) throw new Response("No Recipe found", { status: 404 });

  return { recipe };
}

export default function RecipeId() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{data.recipe?.title}</h1>
      <p>{data.recipe?.content}</p>
    </div>
  );
}
