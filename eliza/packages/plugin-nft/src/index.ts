import type { Plugin } from "@elizaos/core";
import { nftMintingAction } from "./actions/nftMinting.ts";

export * as actions from "./actions/index.ts";
export * from "./types";

export const nftPlugin: Plugin = {
    name: "nft",
    description: "Mints NFTs with AI generated images",
    actions: [nftMintingAction],
    evaluators: [],
    providers: [],
};
export default nftPlugin;
