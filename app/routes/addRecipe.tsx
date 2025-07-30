import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { flattenErrorZod, recipeSchema } from "../utils/validationsZod";
import IngredientsForm from "../components/IngredientsForm";
import { getSession } from "../lib/sessions.server";
import { createRecipe } from "../lib/recipe.server";

type RecipeActionData = {
  errors?: {
    title?: string[];
    content?: string[];
    ingredients?: { name: string; amount: string }[];
    publish?: string[];
  };
  formErrors?: string[];
  values?: Record<string, unknown>;
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const authorId = Number(session.get("userId"));

  const formData = await request.formData();

  const rawData = Object.fromEntries(formData.entries());
  const published = rawData.published === "on";
  const ingredients = JSON.parse(rawData.ingredientsJSON as string);
  const result = recipeSchema.safeParse({ ...rawData, published, ingredients });

  if (!result.success) {
    const { fieldErrors } = flattenErrorZod(result.error);
    console.log("FIELD ERRORS:", fieldErrors);
    return {
      errors: fieldErrors,
      formErrors: ["Welp! Please try again."],
      values: rawData,
    } satisfies RecipeActionData;
  }

  const { title, content } = result.data;

  createRecipe(
    title,
    content,
    result.data.ingredients,
    result.data.published,
    authorId,
  );

  return redirect("/recipes");
}

export default function addRecipe() {
  const actionData = useActionData<RecipeActionData>();
  console.log("actionData", { actionData });
  return (
    <div className="grow w-sm content-evenly">
      <h1 className="mb-8 justify-self-center">Add your recipe here!</h1>
      <Form method="POST" noValidate>
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
              defaultValue={actionData?.values?.title as string}
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
              required
            />
          </label>
        </p>
        {/* ingredient form goes here */}
        <IngredientsForm />
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
          Add Recipe
        </button>
      </Form>
    </div>
  );
}
