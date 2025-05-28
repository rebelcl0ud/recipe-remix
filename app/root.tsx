import { LinksFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import styles from "./tailwind.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col items-center">
        <Header />
        <Outlet />
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
