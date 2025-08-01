import * as z from "zod/v4";

export const registrationSchema = z
  .object({
    username: z.string().toLowerCase().optional().default("friend"),
    email: z.email().toLowerCase(),
    password: z.string().min(12),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // indicates (to Zod) where the err belongs
    message: "Oops! Passwords don't match, try again.",
  });

export type RegisterFormInput = z.infer<typeof registrationSchema>;

export function flattenErrorZod(error: z.ZodError) {
  return z.flattenError(error);
}

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().nonempty(),
});

export const recipeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().max(305),
  ingredients: z
    .array(
      z.object({
        name: z.string().toLowerCase(),
        amount: z.string().toLowerCase(),
      }),
    )
    .min(1, "You must add >= 1 ingredient/amount"),
  published: z.boolean(),
});
