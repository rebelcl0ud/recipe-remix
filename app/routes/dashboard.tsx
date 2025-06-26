import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "../lib/sessions.server";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "../lib/prisma.server";
import { formatUsername } from "../utils/helpers";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      username: true,
    },
  });

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
