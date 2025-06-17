import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Header from "../../app/components/Header";

describe("header", () => {
  test("menu", async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const homeLink = screen.getByText(/home/i);
    const recipeLink = screen.getByText(/recipes/i);
    const aboutLink = screen.getByText(/about/i);

    expect(homeLink).toBeInTheDocument();
    expect(recipeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
    expect(recipeLink).toHaveAttribute("href", "/recipes");
    expect(aboutLink).toHaveAttribute("href", "/about");
  });
});
