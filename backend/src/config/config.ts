import "dotenv/config";

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is empty");
}

export const config = {
  port: process.env.PORT || 3001,
  privateKey: process.env.PRIVATE_KEY,
};
