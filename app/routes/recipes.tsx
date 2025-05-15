import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "../lib/prisma.server";

export async function loader() {
  const recipes = await prisma.recipe.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return { recipes };
}

export default function RecipesLayout() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <aside>
        <ul>
          {data.recipes.map((recipe: { id: number; title: string }) => (
            <li key={recipe.id}>
              <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <main>
        <h1>Recipes</h1>
        <Outlet />
      </main>
    </div>
  );
}
