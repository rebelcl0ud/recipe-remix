import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { checkIfUserExists, createUser } from "../lib/auth.server";
import { flattenErrorZod, registrationSchema } from "../utils/validationsZod";

type RegisterActionData = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    username?: string[];
  };
  formErrors?: string[];
  values?: Record<string, unknown>;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const rawData = Object.fromEntries(formData.entries());
  const result = registrationSchema.safeParse(rawData);

  if (!result.success) {
    const { fieldErrors } = flattenErrorZod(result.error);
    console.log("FIELD ERRORS:", fieldErrors);
    return {
      errors: fieldErrors,
      formErrors: ["Welp! Please try again."],
      values: rawData,
    } satisfies RegisterActionData;
  }

  // pw + create user after checking for existing user
  const { email, password, username } = result.data;
  const existingUser = await checkIfUserExists(email);

  if (existingUser) {
    return {
      ...existingUser,
      values: rawData,
    };
  }

  await createUser(email, password, username);
  return redirect("/login");
}

export default function Register() {
  const actionData = useActionData<RegisterActionData>();

  return (
    <div className="grow w-sm content-evenly">
      <h1 className="mb-8 justify-self-center">Register here!</h1>
      <Form method="POST" noValidate>
        {actionData?.formErrors?.length ? (
          <div className="mb-4 p-2 bg-red-100 text-red-500 rounded">
            {actionData.formErrors.map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        ) : null}
        <p className="my-4">
          <label className="flex flex-col ">
            Username: (optional)
            <input
              className="bg-antiquewhite rounded-sm p-2"
              type="username"
              name="username"
              defaultValue={actionData?.values?.username as string}
            />
          </label>
        </p>
        <p className="my-4">
          <label className="flex flex-col ">
            Email:
            <input
              className="bg-antiquewhite rounded-sm p-2"
              type="email"
              name="email"
              defaultValue={actionData?.values?.email as string}
              required
            />
          </label>
          {actionData?.errors?.email ? (
            <em className="text-red-500">{actionData?.errors.email[0]}</em>
          ) : null}
        </p>
        <p className="my-4">
          <label className="flex flex-col ">
            Password:
            <input
              className="bg-antiquewhite rounded-sm p-2"
              type="password"
              name="password"
              required
            />
          </label>
          {actionData?.errors?.password ? (
            <em className="text-red-500">{actionData?.errors.password[0]}</em>
          ) : null}
        </p>
        <p>
          <label className="flex flex-col ">
            Confirm Password:
            <input
              className="bg-antiquewhite rounded-sm p-2"
              type="password"
              name="confirmPassword"
              required
            />
          </label>
          {actionData?.errors?.confirmPassword ? (
            <em className="text-red-500">
              {actionData?.errors.confirmPassword[0]}
            </em>
          ) : null}
        </p>
        <button
          className="my-4 px-4 py-2 rounded-sm bg-antiquewhite"
          type="submit"
        >
          Register
        </button>
      </Form>
      Already registered?{" "}
      <Link className="text-blue-500" to="/login">
        Login here.
      </Link>
    </div>
  );
}
