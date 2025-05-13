import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "../lib/prisma.server";

export async function loader() {
  const recipes = await prisma.recipe.findMany();

  return { recipes };
}

export default function RecipesLayout() {
  const data = useLoaderData<typeof loader>();
  console.log("RecipesLayout");
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
