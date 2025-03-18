import * as viemChains from "viem/chains";

const _SupportedChainList = Object.keys(viemChains) as Array<
    keyof typeof viemChains
>;
export type SupportedChain = (typeof _SupportedChainList)[number];

export interface PromptData {
    name: string | null;
    description: string;
    toAddress: string;
}

export interface NftMintingParams {
    tokenUri: string;
    toAddress: string;
}

export interface NftMintingTransaction {
    hash: string;
    from: string;
    to: string;
    tokenUri: string;
}