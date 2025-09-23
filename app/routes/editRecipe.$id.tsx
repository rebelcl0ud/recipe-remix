import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { prisma } from "../lib/prisma.server";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { updateRecipe } from "../lib/recipe.server";
import { flattenErrorZod, recipeSchema } from "../utils/validationsZod";
import IngredientsForm from "../components/IngredientsForm";
import type { RecipeActionData } from "../types/recipe";

export async function loader({ params }: LoaderFunctionArgs) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(params.id) },
  });

  if (!recipe) {
    throw new Response("Recipe to edit, not found", { status: 404 });
  }

  return { recipe };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = Number(formData.get("id"));
  const rawData = Object.fromEntries(formData.entries());

  const published = rawData.published === "on";
  const ingredients = JSON.parse(rawData.ingredientsJSON as string);

  const result = recipeSchema.safeParse({ ...rawData, published, ingredients });
  console.log("in editRecipe", { result });

  if (!result.success) {
    const { fieldErrors } = flattenErrorZod(result.error);
    return {
      errors: fieldErrors,
      formErrors: ["Welp! Please try again."],
      values: rawData,
    };
  }

  const { title, content } = result.data;

  await updateRecipe(
    Number(id),
    title,
    content,
    result.data.ingredients,
    result.data.published,
  );

  return redirect(`/recipes/${id}`);
}

export default function editRecipe() {
  const actionData = useActionData<RecipeActionData>();
  const { recipe } = useLoaderData<typeof loader>();

  return (
    <div className="grow w-sm content-evenly">
      <h1 className="mb-8 justify-self-center">Edit your recipe here!</h1>
      <Form method="POST">
        <input type="hidden" name="id" value={recipe.id} />
        {actionData?.formErrors?.length ? (
          <div className="mb-4 p-2 bg-red-100 text-red-500 rounded">
            {actionData.formErrors.map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        ) : null}
        <p className="my-4">
          <label className="flex flex-col">
            Title
            <input
              className="bg-antiquewhite rounded-sm p-2"
              type="text"
              name="title"
              defaultValue={recipe.title}
              required
            />
          </label>
          {actionData?.errors?.title ? (
            <em className="text-red-500">{actionData?.errors.title[0]}</em>
          ) : null}
        </p>
        <p className="my-4">
          <label className="flex flex-col">
            Content (brief description)
            <input
              className="bg-antiquewhite rounded-sm p-2"
              type="text"
              name="content"
              defaultValue={recipe.content || ""}
              required
            />
          </label>
          {actionData?.errors?.content ? (
            <em className="text-red-500">{actionData?.errors.content[0]}</em>
          ) : null}
        </p>
        <IngredientsForm error={actionData?.errors?.ingredients?.[0]} />
        <p className="mt-8 mb-4">
          <label className="inline-flex">
            Publish?
            <input
              className="bg-antiquewhite rounded-sm mx-2 p-2"
              type="checkbox"
              name="published"
            />
          </label>
        </p>
        <button className="px-4 py-2 rounded-sm bg-antiquewhite" type="submit">
          Update Recipe
        </button>
      </Form>
    </div>
  );
}
