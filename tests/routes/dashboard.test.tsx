import { expect, test, vi, describe, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { getSession } from "../../app/lib/sessions.server";
import { createMockSession, fakeDate } from "../helpers/mocks";
import { LoaderFunctionArgs, Session } from "@remix-run/node";
import { loader } from "../../app/routes/dashboard";
import { findUserById } from "../../app/lib/auth.server";
import { prisma } from "../../app/lib/prisma.server";

vi.mock("../../app/lib/sessions.server", () => ({
  getSession: vi.fn(),
}));
vi.mock("../../app/lib/auth.server", () => ({
  findUserById: vi.fn(),
}));
vi.mock("../../app/lib/prisma.server", () => ({
  prisma: {
    recipe: {
      findMany: vi.fn(),
    },
  },
}));

describe("dashboard: loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("no userId, redirects to /login", async () => {
    const mockSession = createMockSession();

    vi.mocked(getSession).mockResolvedValue(mockSession);

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/dashboard"),
      params: {},
      context: {},
    };

    const response = await loader(args);

    expect(response).toBeInstanceOf(Response);
    expect(response).toHaveProperty("status", 302);
    expect((response as Response).headers.get("Location")).toBe("/login");
  });

  test("returns username + unpublished recipes on valid session", async () => {
    const mockSession = createMockSession({
      get: (() => "123") as Session["get"],
    });

    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(findUserById).mockResolvedValue({
      username: "test",
    });
    vi.spyOn(prisma.recipe, "findMany").mockResolvedValue([
      {
        id: 1,
        title: "test recipe",
        content: "",
        published: false,
        createdAt: fakeDate,
        updatedAt: fakeDate,
        deletedAt: null,
        authorId: 8,
      },
    ]);

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/dashboard"),
      params: {},
      context: {},
    };
    const response = await loader(args);

    expect(response).toEqual({
      username: "test",
      recipes: [
        {
          id: 1,
          title: "test recipe",
          published: false,
          content: "",
          createdAt: fakeDate,
          updatedAt: fakeDate,
          deletedAt: null,
          authorId: 8,
        },
      ],
    });
  });

  test("fallback username when missing", async () => {
    const mockSession = createMockSession({
      get: (() => "123") as Session["get"],
    });

    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(findUserById).mockResolvedValue(null);
    vi.spyOn(prisma.recipe, "findMany").mockResolvedValue([]);

    const args: LoaderFunctionArgs = {
      request: new Request("http://localhost/dashboard"),
      params: {},
      context: {},
    };
    const response = await loader(args);

    expect(response).toEqual({
      username: "friend",
      recipes: [],
    });
  });
});

// -- loader --
// session/cookie => userID
// no userID => /login
// recipes

// username => given or default (friend)
// recipes => drafts (list non-published)
