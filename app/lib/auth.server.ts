import bcrypt from "bcrypt";
import { prisma } from "./prisma.server";

export async function checkIfUserExists(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return {
      errors: {
        email: ["Email already registered."],
      },
    };
  }

  return null;
}

export async function createUser(
  email: string,
  password: string,
  username?: string,
) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return prisma.user.create({
    data: {
      ...(username ? { username } : {}), // when null set, default ('friend') will not be used
      email: email,
      password: hashedPassword,
    },
  });
}

export async function findUserById(userId: string | undefined) {
  return prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      username: true,
    },
  });
}

export async function validateCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user.id : null;
}
