import { config } from "../config/config.js";
import neynarClient from "../lib/neynar.js";
import agentService from "./agent.service.js";
import { WebhookEvent } from "../types/webhook.types.js";
import { AgentResponse, AgentResponseData } from "../types/agent.types.js";
import { PostCastResponse } from "@neynar/nodejs-sdk/build/api/index.js";
import { errorWithTimestamp, logWithTimestamp } from "../utils/logging.js";

class WebhookService {
  async handleMention(event: WebhookEvent) {
    const webhookData = event.data;
    if (!webhookData) {
      throw new Error("Invalid webhook data.");
    }
    const text = webhookData.text;
    if (!text) {
      throw new Error("Invalid or missing text in webhook data.");
    }
    if (!text.toLowerCase().trim().startsWith("@aethermint")) {
      throw new Error(
        "The text does not start with @aethermint, it's not a mention."
      );
    }
    const message = text.replace("@aethermint", "").trim();
    logWithTimestamp(`Received mention: ${message}`);
    //logWithTimestamp(util.inspect(data, { depth: null, colors: true }));
    const agentId = await agentService.fetchAgent();
    const agentResponse = (await agentService.sendMessageToAgent(
      agentId,
      message
    )) as AgentResponse;

    const responseData = agentResponse.data;
    const mintData = responseData.find((item) =>
      item.text.startsWith("Successfully minted the NFT")
    );
    this.validateDate(mintData);
    logWithTimestamp(`Agent response data: ${JSON.stringify(mintData)}`);

    const author = webhookData.author.username;
    const textToPublish = `@${author} ${mintData.text}`;
    const castResponse = await this.publishCast(
      textToPublish,
      mintData.content.imageUrl
    );
    return castResponse;
  }

  private validateDate(mintData: AgentResponseData) {
    if (!mintData) {
      throw new Error("No successfully minted NFT data found.");
    }
    if (!mintData.text || !mintData.content.imageUrl) {
      throw new Error("Mint data text or image URL is missing.");
    }
  }

  async publishCast(text: string, imageUrl: string): Promise<PostCastResponse> {
    try {
      const neynarResponse = await neynarClient.publishCast({
        signerUuid: config.signer_uuid,
        text: text,
        embeds: [
          {
            url: imageUrl,
          },
        ],
      });
      logWithTimestamp(
        `Published cast: ${text} \nEmbedded image URL ${imageUrl}`
      );
      return neynarResponse;
    } catch (error) {
      errorWithTimestamp(`Failed to publish cast`, error);
      throw error;
    }
  }
}

export default new WebhookService();
