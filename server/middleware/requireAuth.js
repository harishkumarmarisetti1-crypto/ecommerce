import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function requireAuth(request, response, next) {
  try {
    const authorization = request.get("authorization") || "";
    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
      return response.status(401).json({
        code: "AUTH_REQUIRED",
        message: "Please sign in to continue.",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return response.status(401).json({
        code: "SESSION_INVALID",
        message: "Your session is no longer valid. Please sign in again.",
      });
    }

    request.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return response.status(401).json({
        code: "SESSION_INVALID",
        message: "Your session has expired. Please sign in again.",
      });
    }
    return next(error);
  }
}
