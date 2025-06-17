import {
  expect,
  test,
  vi,
  describe,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import * as Remix from "@remix-run/react";
import RecipesId, { loader } from "../../app/routes/recipes.$recipeId";
import { prisma } from "../../app/lib/prisma.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

beforeEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
});

vi.mock("@remix-run/react", async () => {
  const actual = await import("@remix-run/react");
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

describe("component: recipeId", () => {
  test("renders recipe when valid data provided", () => {
    const mockRecipe = {
      recipe: {
        title: "Test Recipe",
        content: "This is a mock recipe.",
        ingredients: [
          { id: 1, amount: "1 cup", ingredient: { name: "Mock Sugar" } },
          { id: 2, amount: "1 cup", ingredient: { name: "Mock Cocoa Powder" } },
        ],
      },
    };

    (Remix.useLoaderData as ReturnType<typeof vi.fn>).mockReturnValue(
      mockRecipe,
    );

    render(
      <MemoryRouter>
        <RecipesId />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(screen.getByText("This is a mock recipe.")).toBeInTheDocument();
    expect(screen.getByText("1 cup Mock Sugar")).toBeInTheDocument();
    expect(screen.getByText("1 cup Mock Cocoa Powder")).toBeInTheDocument();
  });

  test("no recipe returned", () => {
    (Remix.useLoaderData as ReturnType<typeof vi.fn>).mockReturnValue({
      recipe: undefined,
    });

    render(
      <MemoryRouter>
        <RecipesId />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Test Recipe")).not.toBeInTheDocument();
    expect(
      screen.getByText("Womp Womp! Something went wrong."),
    ).toBeInTheDocument();
  });
});

vi.mock("../../app/lib/prisma.server", () => ({
  prisma: {
    recipe: {
      findUnique: vi.fn(),
    },
  },
}));

describe("loader: recipeId", () => {
  test("throws 404 if no recipe found", async () => {
    vi.spyOn(prisma.recipe, "findUnique").mockResolvedValue(null);

    const args: LoaderFunctionArgs = {
      request: new Request("http://mockdotcom/recipes/999"),
      params: { recipeId: "999" },
      context: {},
    };

    await expect(loader(args)).rejects.toBeInstanceOf(Response);
    await expect(loader(args)).rejects.toHaveProperty("status", 404);
  });
});
