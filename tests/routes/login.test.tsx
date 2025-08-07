import { describe, test, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LoginForm from "../../app/components/LoginForm";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

// TODO: 🗣️ moaaaarrrrrrr :P
describe("component: login", () => {
  test("form: ui", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/login",
          element: <LoginForm />,
        },
      ],
      {
        initialEntries: ["/login"],
      },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
