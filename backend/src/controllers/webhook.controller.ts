import { Request, Response } from "express";
import WebhookService from "../services/webhook.service.js";
import { WebhookEvent } from "../types/webhook.types.js";

export async function handleMention(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const event = req.body as WebhookEvent;
    const result = await WebhookService.handleMention(event);
    res.status(200).send(result);
  } catch (e: any) {
    console.error(`[${new Date().toISOString()}] Error handling mention:`, e);
    res.status(500).send(e.message);
  }
}
