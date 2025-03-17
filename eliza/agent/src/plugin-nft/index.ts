import type { Plugin } from "@elizaos/core";
import { nftMintingAction } from "./actions/nftMinting";

export const mintNftPlugin: Plugin = {
    name: "mintNft",
    description: "NFT minting plugin",
    providers: [],
    evaluators: [],
    services: [],
    actions: [nftMintingAction],
};

export default mintNftPlugin;