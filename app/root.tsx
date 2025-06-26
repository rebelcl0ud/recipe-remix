import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, useLoaderData } from "@remix-run/react";
import styles from "./tailwind.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getSession } from "./lib/sessions.server";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  return { userId };
}

export default function App() {
  const { userId } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col items-center">
        <Header userId={userId} />
        <Outlet />
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
