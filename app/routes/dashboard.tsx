import {
  ActionFunctionArgs,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { getSession } from "../lib/sessions.server";
import { useLoaderData, Form } from "@remix-run/react";
import { formatUsername } from "../utils/helpers";
import { findUserById } from "../lib/auth.server";
import { prisma } from "../lib/prisma.server";
import { deleteRecipe } from "../lib/recipe.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  const user = await findUserById(userId);
  const username = user?.username ?? "friend";

  const recipes = await prisma.recipe.findMany({
    where: {
      authorId: Number(userId),
      published: false,
      deletedAt: null,
    },
    select: {
      title: true,
      published: true,
      id: true,
    },
  });

  return { username, recipes };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, id } = Object.fromEntries(formData);

  console.log("action/dashboard", _action, id);

  if (_action === "delete" && id) {
    await deleteRecipe(Number(id));
    return redirect("/dashboard");
  }

  return null;
}

export default function Dashboard() {
  console.log("dashboard");
  const { username, recipes } = useLoaderData<typeof loader>();
  console.log("dashboard", { username, recipes });

  const usernameCapitalized = formatUsername(username);

  return (
    <div className="grow w-sm">
      <h1 className="my-8 justify-self-center">
        {`Hello there, ${usernameCapitalized}!`}
      </h1>
      <p className="justify-self-center">Unpublished Recipes</p>
      <ul>
        {recipes.map((recipe, idx) => (
          <li
            key={idx}
            className="flex flex-col my-2 p-2 rounded-md bg-antiquewhite"
          >
            <div className="self-center py-2">{recipe.title}</div>
            <div className="flex justify-evenly py-2 bg-seashell rounded-sm border">
              <button>edit</button>
              <div className="border-r"></div>
              <Form method="POST">
                <input type="hidden" name="id" value={recipe.id}></input>
                <button type="submit" name="_action" value="delete">
                  delete
                </button>
              </Form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
