import { expect, test, vi, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import RecipesLayout from "../../app/routes/recipes";

vi.mock("@remix-run/react", async () => {
  const actual = await import("@remix-run/react");
  return {
    ...actual,
    useLoaderData: () => ({
      recipes: [
        { id: 1, title: "Mock Recipe", published: true },
        { id: 2, title: "Unpublished Recipe", published: false },
      ],
    }),
  };
});

describe("recipes", () => {
  test("renders published recipes", async () => {
    render(
      <MemoryRouter>
        <RecipesLayout />
      </MemoryRouter>,
    );

    expect(screen.getByText("Mock Recipe")).toBeInTheDocument();
    expect(screen.queryByText("Unpublished Recipe")).not.toBeInTheDocument();
  });
});
