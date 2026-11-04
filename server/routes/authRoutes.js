import bcrypt from "bcryptjs";
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { User } from "../models/User.js";
import { createToken, publicUser } from "../utils/auth.js";
import { loginSchema, signupSchema } from "../validation/authSchemas.js";

const router = Router();

function validationFailure(response, result) {
  return response.status(400).json({
    code: "VALIDATION_ERROR",
    message: result.error.issues[0]?.message || "Check the submitted details.",
    errors: result.error.flatten().fieldErrors,
  });
}

router.post("/signup", async (request, response, next) => {
  try {
    const result = signupSchema.safeParse(request.body);
    if (!result.success) return validationFailure(response, result);

    const { name, email, password } = result.data;
    if (await User.exists({ email })) {
      return response.status(409).json({
        code: "USER_EXISTS",
        message: "This email is already registered. Sign in to continue.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    return response.status(201).json({
      token: createToken(user.id, true),
      user: publicUser(user),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({
        code: "USER_EXISTS",
        message: "This email is already registered. Sign in to continue.",
      });
    }
    return next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const result = loginSchema.safeParse(request.body);
    if (!result.success) return validationFailure(response, result);

    const { email, password, remember = true } = result.data;
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return response.status(404).json({
        code: "USER_NOT_FOUND",
        message: "No account exists for this email. Create an account to continue.",
      });
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return response.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "The password you entered is incorrect.",
      });
    }

    return response.json({
      token: createToken(user.id, remember),
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (request, response) => {
  response.json({ user: publicUser(request.user) });
});

router.post("/logout", (_request, response) => response.status(204).end());

export default router;
