import { Router } from "express";
import labelRoute from "./nft.routes.js";
import webhookRoute from "./webhook.routes.js";

// Index
const indexRoute = Router();

indexRoute.get("", async (req, res) => {
  res.json({ message: "The Aethermint server is online" });
});

indexRoute.use("/api/nfts", labelRoute);
indexRoute.use("/api/webhook", webhookRoute);
export default indexRoute;
