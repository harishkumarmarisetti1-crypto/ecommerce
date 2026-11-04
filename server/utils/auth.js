import jwt from "jsonwebtoken";

export function createToken(userId, remember = true) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: remember ? "30d" : "1d",
  });
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}
