import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import indexRoute from "./routes/index.js";
import { logWithTimestamp } from "./utils/logging.js";
import { connectToMongoDB } from "./lib/mongodb.js";

await connectToMongoDB();

const app = express();
app.set("trust proxy", true);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/", indexRoute);
app.listen(config.port, () => {
  logWithTimestamp(`Server is running on port ${config.port}`);
});
