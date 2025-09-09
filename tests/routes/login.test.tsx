import { describe, test, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LoginForm from "../../app/components/LoginForm";
import { loader } from "../../app/routes/login";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { LoaderFunctionArgs, Session } from "@remix-run/node";
import { commitSession, getSession } from "../../app/lib/sessions.server";

vi.mock("@remix-run/react", async () => {
  const actual = await import("@remix-run/react");
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

vi.mock("../../app/lib/sessions.server", () => ({
  getSession: vi.fn(),
  commitSession: vi.fn(),
}));

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

describe("loader: login", () => {
  test("redirects user if logged in", async () => {
    vi.mocked(getSession).mockResolvedValue({
      has: () => true,
      get: () => null,
    } as Partial<Session> as Session);

    vi.mocked(commitSession).mockResolvedValue("committed-cookie");

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/login", {
        headers: { Cookie: "cookie" },
      }),
      params: {},
      context: {},
    };

    const response = await loader(args);

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/");
  });

  test("return sessionError when not logged in", async () => {
    vi.mocked(getSession).mockResolvedValue({
      has: () => false,
      get: () => "error",
    } as Partial<Session> as Session);

    vi.mocked(commitSession).mockResolvedValue("committed-cookie");

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/login", {
        headers: { Cookie: "cookie" },
      }),
      params: {},
      context: {},
    };

    const response = await loader(args);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sessionError: "error" });
    expect(response.headers.get("Set-Cookie")).toBe("committed-cookie");
  });
});
