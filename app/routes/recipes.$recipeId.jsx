import { useParams } from "@remix-run/react";

export default function RecipeId() {
  const params = useParams();

  console.log("RecipeId");
  return <h1>{`Testing... ${params.recipeId}`}</h1>;
}
