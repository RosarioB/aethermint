import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { config } from "./config.js";

const neynarConfig = new Configuration({
  apiKey: config.neynar_api_key,
});

const neynarClient = new NeynarAPIClient(neynarConfig);

export default neynarClient;