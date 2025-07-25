import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect } from "@remix-run/react";
import { destroySession, getSession } from "../lib/sessions.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function logout() {
  console.log("logout page");
  return (
    <div className="grow w-sm content-evenly">
      <h1 className="my-8 justify-self-center">You sure you want to logout?</h1>
      <Form method="POST">
        <button
          className="w-full my-4 px-4 py-2 rounded-sm bg-antiquewhite"
          type="submit"
        >
          Ciao!
        </button>
      </Form>
      <Link className="flex justify-self-center text-blue-500" to="/dashboard">
        Just kidding, I changed my mind.
      </Link>
    </div>
  );
}
