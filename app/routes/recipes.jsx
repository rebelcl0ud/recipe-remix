import { Link, Outlet } from "@remix-run/react";
import { dummyData } from "../data/db.js";

export default function RecipesLayout() {
  console.log("RecipesLayout");
  return (
    <div>
      <aside>
        <ul>
          {dummyData.map(({ id, title }) => (
            <li key={id}>
              <Link to={`/recipes/${id}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <main>
        <h1>Recipes</h1>
        <Outlet />
      </main>
    </div>
  );
}
