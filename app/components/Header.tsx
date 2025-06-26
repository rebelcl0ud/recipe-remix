import { Link } from "@remix-run/react";

type HeaderProps = {
  userId: string | undefined;
};

export default function Header({ userId }: HeaderProps) {
  return (
    <div className="shrink-0 m-8">
      <Link className="p-4" to="/">
        Home
      </Link>
      <Link className="p-4" to="/about">
        About
      </Link>
      <Link className="p-4" to="/recipes">
        Recipes
      </Link>
      <Link className="p-4" to="/dashboard">
        {userId ? "Dashboard" : ""}
      </Link>
      <Link className="p-4" to="/register">
        {userId ? "Logout" : "Login | Register"}
      </Link>
    </div>
  );
}
