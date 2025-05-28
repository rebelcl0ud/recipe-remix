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
    </div>
  );
}
