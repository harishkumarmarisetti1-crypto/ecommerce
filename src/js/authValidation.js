import { z } from "zod";
const email = z
  .string()
  .trim()
  .min(1, "Email address is required.")
  .email("Enter a valid email address.");

const password = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(64, "Password cannot exceed 64 characters.")
  .regex(/[a-z]/, "Add at least one lowercase letter.")
  .regex(/[A-Z]/, "Add at least one uppercase letter.")
  .regex(/\d/, "Add at least one number.");

export const loginSchema = z.object({
  email,
  password: z.string().min(8, "Password must contain at least 8 characters."),
  remember: z.boolean(),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters.")
      .max(50, "Name cannot exceed 50 characters.")
      .regex(/^[\p{L}][\p{L}\p{M} .'’-]*$/u, "Enter a valid full name."),
    email,
    password,
    confirm: z.string().min(1, "Please confirm your password."),
    remember: z.boolean(),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export function getValidationErrors(error) {
  return error.issues.reduce((errors, issue) => {
    const field = issue.path[0];
    if (field && !errors[field]) errors[field] = issue.message;
    return errors;
  }, {});
}
