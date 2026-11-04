import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = Number(process.env.PORT) || 5000;

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("MONGODB_URI and JWT_SECRET must be set in the .env file.");
  process.exit(1);
}

try {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
  });
} catch (error) {
  console.error("Unable to start the API server:", error.message);
  process.exit(1);
}
