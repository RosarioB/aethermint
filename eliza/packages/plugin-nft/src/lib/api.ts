import axios from "axios";
import { config } from "./config";
import { elizaLogger } from "@elizaos/core";

export interface Nft {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    jsonIpfsUrl: string;
    owner: string;
    createdAt?: Date;
}

export async function createNft(data: Nft): Promise<string> {
    const endpoint = config.backend_url + "/api/nfts";

    try {
        const response = await axios.post(endpoint, data);
        elizaLogger.info(
            `[${new Date().toISOString()}] Create NFT endpoint successfully invoked`
        );
        return response.data;
    } catch (error) {
        elizaLogger.error(
            `[${new Date().toISOString()}] Error invoking the create NFT endpoint: ${
                error.message
            }`
        );
        throw error;
    }
}
