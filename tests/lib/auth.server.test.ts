import { describe, expect, test, vi } from "vitest";
import { prisma } from "../../app/lib/prisma.server";
import bcrypt from "bcrypt";
import {
  checkIfUserExists,
  createUser,
  validateCredentials,
} from "../../app/lib/auth.server";

vi.mock("../../app/lib/prisma.server", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
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

describe("verify registration", () => {
  test("email already exists", async () => {
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

    const user = await checkIfUserExists("james.bond@mi6.com");

    expect(user).not.toBeNull();
    expect(user!.errors.email[0]).toEqual("Email already registered.");
  });

  test("email does not exist, successful registration", async () => {
    vi.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

    const user = await checkIfUserExists("james.bond@mi6.com");
    expect(user).toBeNull();
  });
});

describe("user creation", () => {
  test("user creation, success", async () => {
    const prismaSpy = vi.spyOn(prisma.user, "create").mockResolvedValue({
      id: Number("007"),
      username: "james",
      email: "james.bond@mi6.com",
      password: "hashed",
      createdAt: fakeDate,
      updatedAt: fakeDate,
      deletedAt: null,
    });

    (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue("hashed");

    const user = await createUser("james.bond@mi6.com", "password", "james");

    expect(bcrypt.hash).toHaveBeenCalledWith("password", 12);
    expect(prismaSpy).toHaveBeenCalledWith({
      data: {
        email: "james.bond@mi6.com",
        password: "hashed",
        username: "james",
      },
    });
    expect(user.email).toBe("james.bond@mi6.com");
    expect(user.password).toBe("hashed");
    expect(user.username).toBe("james");
  });
});
