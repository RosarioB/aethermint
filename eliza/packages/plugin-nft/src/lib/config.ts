function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is missing. Please set it in your .env file.`);
  }
  return value;
}

export const config = {
  erc721_address: getEnvVariable("ERC721_ADDRESS"),
  evm_private_key: getEnvVariable("EVM_PRIVATE_KEY"),
  pinata_jwt: getEnvVariable("PINATA_JWT"),
  pinata_gateway_url: getEnvVariable("PINATA_GATEWAY_URL"),
  backend_url: process.env.BACKEND_URL || "http://localhost:3000",
  neynar_api_key: getEnvVariable("NEYNAR_API_KEY"),
};