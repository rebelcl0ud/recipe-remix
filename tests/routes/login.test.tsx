import { describe, test, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LoginForm from "../../app/components/LoginForm";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

// TODO: 🗣️ moaaaarrrrrrr :P
describe("component: login", () => {
  test("form: ui on load", async () => {
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

  test("missing fields on submit", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/login",
          element: (
            <LoginForm
              sessionError={""}
              actionData={{
                errors: {
                  email: ["Invalid email address"],
                  password: [
                    "Too small: expected string to have >=12 characters",
                  ],
                },
              }}
            />
          ),
        },
      ],
      {
        initialEntries: ["/login"],
      },
    );

    render(<RouterProvider router={router} />);

    const emailError = "Invalid email address";
    const pwError = "Too small: expected string to have >=12 characters";

    expect(screen.getByText(emailError)).toBeInTheDocument();
    expect(screen.getByText(pwError)).toBeInTheDocument();
  });
});
