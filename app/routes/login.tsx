import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "../lib/sessions.server";
import { validateCredentials } from "../lib/auth.server";
import { flattenErrorZod, loginSchema } from "../utils/validationsZod";

type LoginActionData = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  formErrors?: string[];
  values?: Record<string, unknown>;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  if (session.has("userId")) return redirect("/");

  const data = {
    error: session.get("error"),
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  console.log("SESSION", { session });

  const formData = await request.formData();

  const rawData = Object.fromEntries(formData.entries());
  const result = loginSchema.safeParse(rawData);

  console.log("FORM DATA", rawData);
  console.log("RESULT", result);

  if (!result.success) {
    console.log("----ERRORS-----");
    const { fieldErrors } = flattenErrorZod(result.error);
    console.log("FIELD ERRORS", fieldErrors);
    return {
      errors: fieldErrors,
      formErrors: ["Welp! Please try again."],
      values: rawData,
    } satisfies LoginActionData;
  }

  const { email, password } = result.data;
  const userId = await validateCredentials(email, password);
  console.log("USERID", { userId });

  if (userId == null) {
    console.log("***hit an error***");
    session.flash("error", "invalid email/password");

    // redirect to login page w/ errors
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("userId", String(userId));

  // login succeeded
  console.log("LOGIN SUCCEEDED");
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();
  const actionData = useActionData<LoginActionData>();

  return (
    <>
      {error ? <div className="text-red-500">{error}</div> : null}
      <div className="grow w-sm">
        <h1 className="my-8 justify-self-center">Welcome back!</h1>
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
              Email:
              <input
                className="bg-[var(--color-antiquewhite)] rounded-sm p-2"
                type="email"
                name="email"
                required
              />
            </label>
            {actionData?.errors?.email ? (
              <em className="text-red-500">{actionData?.errors.email[0]}</em>
            ) : null}
          </p>
          <p className="my-4">
            <label className="flex flex-col">
              Password:
              <input
                className="bg-[var(--color-antiquewhite)] rounded-sm p-2"
                type="password"
                name="password"
                required
              />
            </label>
            {actionData?.errors?.password ? (
              <em className="text-red-500">{actionData?.errors.password[0]}</em>
            ) : null}
          </p>
          <button
            className="my-4 px-4 py-2 rounded-sm bg-[var(--color-antiquewhite)]"
            type="submit"
          >
            Login
          </button>
        </Form>
      </div>
    </>
  );
}
