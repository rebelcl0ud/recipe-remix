import { describe, expect, test, vi } from "vitest";
import { prisma } from "../../app/lib/prisma.server";
import bcrypt from "bcrypt";
import { validateCredentials } from "../../app/lib/auth.server";

vi.mock("../../app/lib/prisma.server", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

const fakeDate = new Date("2025-01-01T00:00:00Z");

describe("verify login", () => {
  test("return user ID on valid login", async () => {
    const testUser = {
      id: Number("007"),
      username: "friend",
      email: "james.bond@mi6.com",
      password: "hashed",
      createdAt: fakeDate,
      updatedAt: fakeDate,
      deletedAt: null,
    };

    vi.spyOn(prisma.user, "findUnique").mockResolvedValue(testUser);
    (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const user = await validateCredentials("james.bond@mi6.com", "password123");
    expect(user).toEqual(testUser.id);
  });
});
