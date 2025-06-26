import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "../lib/sessions.server";
import { useLoaderData } from "@remix-run/react";
import { formatUsername } from "../utils/helpers";
import { findUserById } from "../lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    redirect("/login");
  }

  const user = await findUserById(userId);

  console.log({ user });
  return { username: user?.username };
}

export default function Dashboard() {
  console.log("dashboard");
  const { username } = useLoaderData<typeof loader>();
  console.log({ username });

  const usernameCapitalized = username ? formatUsername(username) : null;

  return (
    <div className="grow w-sm">
      <h1 className="my-8 justify-self-center">
        {`Hello there, ${usernameCapitalized}!`}
      </h1>
      <p>dashboard stuff here</p>
    </div>
  );
}
