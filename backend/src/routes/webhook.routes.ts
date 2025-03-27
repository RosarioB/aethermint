import { Router } from "express";
import { handleMention } from "../controllers/webhook.controller.js";

const router = Router();
router.post("/mention/aethermint", handleMention);

export default router;
