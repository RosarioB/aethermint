import { Request, Response } from "express";
import WebhookService from "../services/webhook.service.js";
import { WebhookEvent } from "../types/webhookEvent.types.js";
import { errorWithTimestamp } from "../utils/logging.js";

export async function handleMention(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const event = req.body as WebhookEvent;
    const castHash = event.data.hash;
    setImmediate(() => {
      WebhookService.handleMention(event).catch((e) => {
        errorWithTimestamp(`Error in handleMention on cast ${castHash}:`, e);
      });
    });
    const result = { message: "Operation accepted" };
    res.status(202).send(result);
  } catch (e: any) {
    errorWithTimestamp(`Error handling mention:`, e);
    res.status(500).send(e.message);
  }
}
