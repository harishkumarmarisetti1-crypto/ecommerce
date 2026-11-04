import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")
  .max(254, "Email address is too long.");

const password = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(64, "Password must contain at most 64 characters.");

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(60, "Name must contain at most 60 characters.")
    .regex(/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u, "Enter a valid full name."),
  email,
  password: password
    .regex(/[a-z]/, "Password needs a lowercase letter.")
    .regex(/[A-Z]/, "Password needs an uppercase letter.")
    .regex(/\d/, "Password needs a number."),
});

export const loginSchema = z.object({
  email,
  password,
  remember: z.boolean().optional(),
});
