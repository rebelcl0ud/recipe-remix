import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "../lib/sessions.server";
import { validateCredentials } from "../lib/auth.server";

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
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  console.log("FORM DATA", email, password);

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

  return (
    <>
      {error ? <div className="text-red-500">{error}</div> : null}
      <div className="grow w-sm">
        <h1 className="my-8 justify-self-center">Welcome back!</h1>
        <Form method="POST">
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
