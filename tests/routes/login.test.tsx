import { describe, test, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LoginForm from "../../app/components/LoginForm";
import { loader, action } from "../../app/routes/login";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { LoaderFunctionArgs, Session } from "@remix-run/node";
import { commitSession, getSession } from "../../app/lib/sessions.server";
import { validateCredentials } from "../../app/lib/auth.server";

function createMockSession(overrides: Partial<Session> = {}): Session {
  return {
    data: {},
    id: "mock-session-id",
    flash: vi.fn(),
    get: vi.fn(() => undefined) as Session["get"],
    has: vi.fn(),
    set: vi.fn(),
    unset: vi.fn(),
    ...overrides,
  };
}

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

vi.mock("../../app/lib/auth.server", () => ({
  validateCredentials: vi.fn(),
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
    const mockSession = createMockSession({
      has: () => true,
    });

    vi.mocked(getSession).mockResolvedValue(mockSession);

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/login"),
      params: {},
      context: {},
    };

    const response = await loader(args);

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/");
  });

  test("return sessionError when not logged in", async () => {
    const mockSession = createMockSession({
      has: () => false,
      get: vi.fn(() => "error") as Session["get"],
    });

    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(commitSession).mockResolvedValue("committed-cookie");

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/login"),
      params: {},
      context: {},
    };

    const response = await loader(args);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sessionError: "error" });
    expect(response.headers.get("Set-Cookie")).toBe("committed-cookie");
  });
});

describe("action: login", () => {
  test("redirect on successful login", async () => {
    const mockSession = createMockSession();

    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(commitSession).mockResolvedValue("committed-cookie");
    vi.mocked(validateCredentials).mockResolvedValue(Number("123")); // userID

    const formData = new URLSearchParams({
      email: "android18@dbz.com",
      password: "secretpassword18",
    });

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      }),
      params: {},
      context: {},
    };

    const result = await action(args);

    expect(result).toHaveProperty("status", 302);
    expect((result as Response).headers.get("Location")).toBe("/dashboard");
    expect(mockSession.set).toHaveBeenCalledWith("userId", "123");
  });

  test("redirects to /login on invalid credentials", async () => {
    const mockSession = createMockSession();

    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(commitSession).mockResolvedValue("committed-cookie");
    vi.mocked(validateCredentials).mockResolvedValue(null);

    const formData = new URLSearchParams({
      email: "android18@dbz.com",
      password: "wrongpw",
    });

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      }),
      params: {},
      context: {},
    };

    const result = await action(args);

    expect(result).toHaveProperty("status", 302);
    expect((result as Response).headers.get("Location")).toBe("/login");
    expect(mockSession.flash).toHaveBeenCalledWith(
      "error",
      "invalid email/password",
    );
  });

  test("returns validation errors on invalid data", async () => {
    const mockSession = createMockSession();

    vi.mocked(getSession).mockResolvedValue(mockSession);

    const formData = new URLSearchParams({
      email: "this-is-so-not-an-email",
      password: "",
    });

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      }),
      params: {},
      context: {},
    };

    const result = await action(args);

    expect(result).toMatchObject({
      errors: {
        email: ["Invalid email address"],
        password: ["Too small: expected string to have >=1 characters"],
      },
      formErrors: ["Welp! Please try again."],
      values: {
        email: "this-is-so-not-an-email",
        password: "",
      },
    });
  });
});
