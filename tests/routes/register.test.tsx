import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import "@testing-library/jest-dom";
import * as Remix from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { checkIfUserExists } from "../../app/lib/auth.server";
import Register, { action } from "../../app/routes/register";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

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
    useActionData: vi.fn(),
  };
});

vi.mock("../../app/lib/prisma.server", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../../app/lib/auth.server", () => ({
  checkIfUserExists: vi.fn(),
  createUser: vi.fn(),
}));

describe("action: register", () => {
  test("register new email", async () => {
    const formData = new URLSearchParams({
      email: "android18@dbz.com",
      password: "secretpassword18",
      confirmPassword: "secretpassword18",
      username: "18",
    });

    const args: ActionFunctionArgs = {
      request: new Request("http://mockdotcom/register", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      }),
      params: {},
      context: {},
    };

    const result = await action(args);

    expect(result).toBeInstanceOf(Response);
    expect(result).toHaveProperty("status", 302);
    expect((result as Response).headers.get("Location")).toBe("/login");
  });

  test("email already registered", async () => {
    vi.mocked(checkIfUserExists).mockResolvedValue({
      errors: {
        email: ["Email already registered."],
      },
    });

    const formData = new URLSearchParams({
      email: "android18@dbz.com",
      password: "secretpassword18",
      confirmPassword: "secretpassword18",
      username: "18",
    });

    const args: ActionFunctionArgs = {
      request: new Request("http://mockdotcom/register", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      }),
      params: {},
      context: {},
    };

    const result = await action(args);

    expect(result).not.toBeInstanceOf(Response);
    expect(result).toMatchObject({
      errors: {
        email: ["Email already registered."],
      },
      values: {
        email: "android18@dbz.com",
        username: "18",
      },
    });
  });
});

describe("component: register", () => {
  test("missing fields on submit", async () => {
    (Remix.useActionData as ReturnType<typeof vi.fn>).mockReturnValue({
      errors: {
        email: ["Invalid email address"],
        password: ["Too small: expected string to have >=12 characters"],
      },
    });

    const router = createMemoryRouter(
      [
        {
          path: "/register",
          element: <Register />,
        },
      ],
      {
        initialEntries: ["/register"],
      },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(
      screen.getByText("Too small: expected string to have >=12 characters"),
    ).toBeInTheDocument();
  });
});
