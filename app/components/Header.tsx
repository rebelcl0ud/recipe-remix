import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <div className="shrink-0 m-8">
      <Link className="p-4" to="/">
        Home
      </Link>
      <Link className="p-4" to="/recipes">
        Recipes
      </Link>
      <Link className="p-4" to="/about">
        About
      </Link>
      <Link className="p-4" to="/register">
        Register
      </Link>
    </div>
  );
}
