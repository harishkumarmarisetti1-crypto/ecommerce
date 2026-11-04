import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many authentication attempts. Please try again shortly.",
    },
  }),
  authRoutes,
);

app.use((_request, response) => {
  response.status(404).json({ code: "NOT_FOUND", message: "API route not found." });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    code: "SERVER_ERROR",
    message: "Something went wrong on the server. Please try again.",
  });
});

export default app;
