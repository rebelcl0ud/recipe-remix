import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "../lib/prisma.server";
import { getSession } from "../lib/sessions.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  const recipes = await prisma.recipe.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      published: true,
    },
  });

  return { recipes, userId };
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
                  {recipe.title}
                </NavLink>
              </li>
            ),
          )}
        </ul>
        {!data.userId ? null : (
          <div className="my-2 relative inline-block">
            <Link
              className="px-4 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[1px] after:w-3/4 after:h-1.5 after:bg-blue-500"
              to="/addRecipe"
            >
              Wanna Add Recipe?
            </Link>
          </div>
        )}
      </aside>
      <main className="w-[560px] px-2">
        <Outlet />
      </main>
    </div>
  );
}
