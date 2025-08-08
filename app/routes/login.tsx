import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "../lib/sessions.server";
import { validateCredentials } from "../lib/auth.server";
import { flattenErrorZod, loginSchema } from "../utils/validationsZod";
import LoginForm from "../components/LoginForm";

export type LoginActionData = {
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
    sessionError: session.get("error"),
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();

  const rawData = Object.fromEntries(formData.entries());
  const result = loginSchema.safeParse(rawData);

  if (!result.success) {
    const { fieldErrors } = flattenErrorZod(result.error);
    return {
      errors: fieldErrors,
      formErrors: ["Welp! Please try again."],
      values: rawData,
    } satisfies LoginActionData;
  }

  const { email, password } = result.data;
  const userId = await validateCredentials(email, password);

  if (userId == null) {
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
  const { sessionError } = useLoaderData<typeof loader>();
  const actionData = useActionData<LoginActionData>();

  return <LoginForm sessionError={sessionError} actionData={actionData} />;
}
