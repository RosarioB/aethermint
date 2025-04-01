import "dotenv/config";

const requiredEnvVariables = [
  { key: "PRIVATE_KEY", message: "PRIVATE_KEY is empty" },
  { key: "NEYNAR_API_KEY", message: "Make sure you set NEYNAR_API_KEY in your .env file" },
  { key: "SIGNER_UUID", message: "Make sure you set SIGNER_UUID in your .env file" },
  { key: "PINATA_GATEWAY_URL", message: "Make sure you set PINATA_GATEWAY_URL in your .env file" },
  { key: "MONGO_URL", message: "Make sure you set MONGO_URL in your .env file" },
];

requiredEnvVariables.forEach(({ key, message }) => {
  if (!process.env[key]) {
    throw new Error(message);
  }
});

export const config = {
  mongodb_url: process.env.MONGO_URL,
  port: process.env.PORT || 3001,
  privateKey: process.env.PRIVATE_KEY,
  neynar_api_key: process.env.NEYNAR_API_KEY,
  signer_uuid: process.env.SIGNER_UUID,
  pinata_gateway_url: process.env.PINATA_GATEWAY_URL,
  eliza_url: process.env.ELIZA_URL || "http://localhost:3000",
};
