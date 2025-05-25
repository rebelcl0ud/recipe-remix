import { LinksFunction } from "@remix-run/node";
import { Link, Links, Meta, Outlet, Scripts } from "@remix-run/react";
import styles from "./tailwind.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body>
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
