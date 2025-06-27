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
      username: username ? username : null,
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
  console.log("hits the validation fn");
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  console.log({ user });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);

  console.log("isValid", isValid);
  return isValid ? user.id : null;
}
