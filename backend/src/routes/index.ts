import { Router } from "express";
import nftRoute from "./nft.routes.js";
import webhookRoute from "./webhook.routes.js";

const indexRoute = Router();

indexRoute.get("", async (req, res) => {
  res.json({ message: "The Aethermint server is online" });
});

indexRoute.use("/api/nfts", nftRoute);
indexRoute.use("/api/webhook", webhookRoute);
export default indexRoute;
