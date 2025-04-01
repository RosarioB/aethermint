import mongoose from "mongoose";
import { errorWithTimestamp, logWithTimestamp } from "../utils/logging.js";
import { config } from "../config/config.js";

export async function connectToMongoDB() {
  try {
    await mongoose.connect(config.mongodb_url, { dbName: "aethermint" });
    logWithTimestamp(`Successfully connected to Mongo DB`);
  } catch (err) {
    errorWithTimestamp(`Error connecting to Mongo DB`, err);
  }
}
