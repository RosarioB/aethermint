import * as viemChains from "viem/chains";

export function base64ToFile(base64Data: string, filename: string): File {
    // Remove the data:image/png;base64 prefix if it exists
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");

    // Create a buffer from the base64 string
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Create a File object
    const file = new File([imageBuffer], filename, { type: "image/png" });

    return file;
}

export function getChainKeyById(chainId: number): keyof typeof viemChains {
    const chainKey = Object.keys(viemChains).find(
      (key) => viemChains[key as keyof typeof viemChains].id === chainId
    ) as keyof typeof viemChains;
  
    return chainKey;
  }