import bcrypt from "bcrypt";
import { prisma } from "./prisma.server";

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
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
