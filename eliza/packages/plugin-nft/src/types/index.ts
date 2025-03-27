import * as viemChains from "viem/chains";
import { z } from "zod";

const _SupportedChainList = Object.keys(viemChains) as Array<
    keyof typeof viemChains
>;
export type SupportedChain = (typeof _SupportedChainList)[number];

export interface NftMintingContent {
    name: string;
    description: string;
    recipient: string;
}

export const NFTSchema = z.object({
    name: z.string(),
    description: z.string(),
    recipient: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
});

export const isNftMintingContent = (object: any): object is NftMintingContent => {
    if (NFTSchema.safeParse(object).success) {
        return true;
    }
    console.error("Invalid content: ", object);
    return false;
};

export interface NftMintingParams {
    jsonHash: string;
    recipient: string;
    name: string;
    description: string;
    imageHash: string;
}

export interface NftMintingTransaction {
    id: string;
    hash: string;
    from: string;
    to: string;
    tokenUri: string;
    imageUrl: string;
}
