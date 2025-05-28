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
    <div className="flex grow items-center justify-center gap-x-24">
      <aside className="w-80">
        <ul>
          {data.recipes.map((recipe: { id: number; title: string }) => (
            <li key={recipe.id}>
              <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="w-[560px] px-2">
        <Outlet />
      </main>
    </div>
  );
}
