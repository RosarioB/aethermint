import "dotenv/config";

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is empty");
}

if (!process.env.NEYNAR_API_KEY) {
  throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
}

if (!process.env.SIGNER_UUID) {
  throw new Error("Make sure you set SIGNER_UUID in your .env file");
}

if (!process.env.PINATA_GATEWAY_URL) {
  throw new Error("Make sure you set PINATA_GATEWAY in your .env file");
}

export const config = {
  port: process.env.PORT || 3001,
  privateKey: process.env.PRIVATE_KEY,
  neynar_api_key: process.env.NEYNAR_API_KEY,
  signer_uuid: process.env.SIGNER_UUID,
  pinata_gateway_url: process.env.PINATA_GATEWAY_URL,
  eliza_url: process.env.ELIZA_URL || "http://localhost:3000",
};
