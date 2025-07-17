import { describe, expect, test, assert } from "vitest";
import { registrationSchema } from "../../app/utils/validationsZod";

describe("register schema", () => {
  test("valid inputs", () => {
    const result = registrationSchema.safeParse({
      email: "peter.parker@dailybugle.com",
      password: "jonahIsASpiderManHater",
      confirmPassword: "jonahIsASpiderManHater",
    });
    expect(result.success).toBe(true);
  });
  test("invalid email", () => {
    const result = registrationSchema.safeParse({
      email: "th1s15notAnEmail",
      password: "password123!",
      confirmPassword: "password123!",
    });
    console.log({ result });

    assert(!result.success);
    expect(result.error.issues[0].message).toBe("Invalid email address");
  });
  test("invalid password, length < 12", () => {
    const result = registrationSchema.safeParse({
      email: "peter.parker@dailybugle.com",
      password: "jonahsux",
      confirmPassword: "jonahsux",
    });
    expect(result.success).toBe(false);
  });
  test("invalid password match", () => {
    const result = registrationSchema.safeParse({
      email: "peter.parker@dailybugle.com",
      password: "jonahisaspidermanhater",
      confirmPassword: "jonahIsASpiderManHater",
    });
    assert(!result.success);
    expect(result.error.issues[0].message).toBe(
      "Oops! Passwords don't match, try again.",
    );
  });
});
