import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import indexRoute from "./routes/index.js";
import { logWithTimestamp } from "./utils/logging.js";

const app = express();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is empty");
}

/* app.use((req: Request, res: Response, next) => {
  logWithTimestamp(
    `${req.method} ${req.path} - ${new Date().toISOString()} - IP: ${req.ip}`
  );
  next();
}); */

app.set("trust proxy", true);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/", indexRoute);

app.listen(config.port, () => {
  logWithTimestamp(`Server is running on port ${config.port}`);
});
