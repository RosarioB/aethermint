import { Router } from "express";
import { mentionWebhook } from "../controllers/webhook.controller.js";

const webhookRoute = Router();

webhookRoute.post("/mention/aethermint", mentionWebhook);

export default webhookRoute;