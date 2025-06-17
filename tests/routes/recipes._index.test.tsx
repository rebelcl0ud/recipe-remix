import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import RecipePage from "../../app/routes/recipes._index";

describe("recipe index page", () => {
  test("default text", async () => {
    render(<RecipePage />);
    expect(screen.getByText("Select a recipe..."));
  });
});
