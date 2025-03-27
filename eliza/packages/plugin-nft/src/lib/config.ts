if (!process.env.ERC721_ADDRESS) {
  throw new Error("Make sure you set ERC721_ADDRESS in your .env file");
}

if(!process.env.EVM_PRIVATE_KEY) {
  throw new Error("Make sure you set EVM_PRIVATE_KEY in your .env file");
}

if(!process.env.PINATA_JWT) {
  throw new Error("Make sure you set PINATA_JWT in your .env file");
}

if(!process.env.PINATA_GATEWAY_URL) {
  throw new Error("Make sure you set PINATA_GATEWAY_URL in your .env file");
}

export const config = {
  erc721_address: process.env.ERC721_ADDRESS,
  evm_private_key: process.env.EVM_PRIVATE_KEY,
  pinata_jwt: process.env.PINATA_JWT,
  pinata_gateway_url: process.env.PINATA_GATEWAY_URL,
  backend_url: process.env.BACKEND_URL || "http://localhost:3000",
};