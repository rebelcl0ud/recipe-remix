import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "../lib/prisma.server";

export async function loader() {
  const recipes = await prisma.recipe.findMany({
    select: {
      id: true,
      title: true,
      published: true,
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
          {data.recipes.map(
            (recipe: { id: number; title: string; published: boolean }) => (
              <li key={recipe.id}>
                <NavLink
                  to={`/recipes/${recipe.id}`}
                  className={({ isActive }) =>
                    [
                      "block px-4 py-1",
                      isActive
                        ? "bg-antiquewhite rounded-t-xl"
                        : "bg-white rounded-t-xl",
                    ].join(" ")
                  }
                >
                  {recipe.published ? recipe.title : null}
                </NavLink>
              </li>
            ),
          )}
        </ul>
      </aside>
      <main className="w-[560px] px-2">
        <Outlet />
      </main>
    </div>
  );
}
