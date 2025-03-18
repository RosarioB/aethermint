import {
    type Action,
    composeContext,
    generateObjectDeprecated,
    type HandlerCallback,
    ModelClass,
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger,
} from "@elizaos/core";

import {
    initWalletProvider,
    type WalletProvider,
} from "@elizaos-plugins/plugin-evm";
import type {
    NftMintingParams,
    NftMintingTransaction,
} from "../types/index.js";
import { isNftMintingContent, NftMintingContent } from "../types/index.js";
import { NFT_MINTING_TEMPLATE } from "../templates/nftMintingTemplate.js";
import { generateAiImage } from "../lib/imageGeneration.js";
import { validateImageGenConfig } from "@elizaos-plugins/plugin-image-generation";
import { uploadJsonToPinata } from "../lib/pinata.js";
import { parseAbi } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const ERC721_ADDRESS = process.env.ERC721_ADDRESS as `0x${string}`;
const OWNER_ERC721 = process.env.OWNER_ERC721 as `0x${string}`;
const account = privateKeyToAccount(
    process.env.EVM_PRIVATE_KEY as `0x${string}`
);

const erc721Abi = parseAbi([
    "function safeMint(address to, string memory uri) public returns (uint256)",
]);

export class NftMintingAction {
    constructor(private walletProvider: WalletProvider) {}

    async mint(params: NftMintingParams): Promise<NftMintingTransaction> {
        elizaLogger.info(
            `Minting NFT with TokenURI ${params.tokenUri} to ${params.recipient}`
        );

        const walletClient = this.walletProvider.getWalletClient("baseSepolia");

        try {
            const txHash = await walletClient.writeContract({
                address: ERC721_ADDRESS,
                abi: erc721Abi,
                functionName: "safeMint",
                args: [OWNER_ERC721, params.tokenUri],
                chain: baseSepolia,
                account: account,
            });

            return {
                hash: txHash,
                from: walletClient.account.address,
                to: params.recipient,
                tokenUri: params.tokenUri,
            };
        } catch (error) {
            throw new Error(
                `Calling the mint function on the smart contract failed: ${error.message}`
            );
        }
    }
}

const buildNftMintingDetails = async (
    state: State,
    runtime: IAgentRuntime,
    wp: WalletProvider
): Promise<NftMintingContent> => {
    const chains = Object.keys(wp.chains);
    state.supportedChains = chains.map((item) => `"${item}"`).join("|");

    const context = composeContext({
        state,
        template: NFT_MINTING_TEMPLATE,
    });

    const promptNftDetails = (await generateObjectDeprecated({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
    })) as NftMintingContent;

    return promptNftDetails;
};

export const nftMintingAction: Action = {
    name: "MINT_NFT",
    similes: ["MINT_TOKEN", "CREATE_TOKEN", "BUILD_TOKEN"],
    description: "Mints NFTs",
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY");
        const isPrivateKeyValid =
            typeof privateKey === "string" && privateKey.startsWith("0x");

        await validateImageGenConfig(runtime);

        const anthropicApiKeyOk = !!runtime.getSetting("ANTHROPIC_API_KEY");
        const nineteenAiApiKeyOk = !!runtime.getSetting("NINETEEN_AI_API_KEY");
        const togetherApiKeyOk = !!runtime.getSetting("TOGETHER_API_KEY");
        const heuristApiKeyOk = !!runtime.getSetting("HEURIST_API_KEY");
        const falApiKeyOk = !!runtime.getSetting("FAL_API_KEY");
        const openAiApiKeyOk = !!runtime.getSetting("OPENAI_API_KEY");
        const veniceApiKeyOk = !!runtime.getSetting("VENICE_API_KEY");
        const livepeerGatewayUrlOk = !!runtime.getSetting(
            "LIVEPEER_GATEWAY_URL"
        );

        const isApiImageGenerationValid =
            anthropicApiKeyOk ||
            togetherApiKeyOk ||
            heuristApiKeyOk ||
            falApiKeyOk ||
            openAiApiKeyOk ||
            veniceApiKeyOk ||
            nineteenAiApiKeyOk ||
            livepeerGatewayUrlOk;

        return isPrivateKeyValid && isApiImageGenerationValid;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback?: HandlerCallback
    ) => {
        let currentState = state;
        if (!currentState) {
            currentState = (await runtime.composeState(message)) as State;
        } else {
            currentState = await runtime.updateRecentMessageState(currentState);
        }

        currentState.currentMessage = `${currentState.recentMessagesData[1].content.text}`;

        elizaLogger.info("NftMinting action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new NftMintingAction(walletProvider);

        const promptData = await buildNftMintingDetails(
            currentState,
            runtime,
            walletProvider
        );

        if (!isNftMintingContent(promptData)) {
            elizaLogger.error("Invalid content for MINT_NFT action.");
            callback({
                text: "Invalid NftMinting details. Ensure name, description, and recipient are correctly specified.",
                content: { error: "Invalid mint NFT content" },
            });
            return false;
        }

        elizaLogger.info(`Validated JSON: ${JSON.stringify(promptData)}`);

        const imageHash = await generateAiImage(
            runtime,
            promptData.description
        );
        const jsonHash = await uploadJsonToPinata(
            promptData.name || "",
            promptData.description,
            imageHash
        );

        const nftMintingParams = {
            tokenUri: jsonHash,
            recipient: promptData.recipient,
        };

        try {
            const transferResp = await action.mint(nftMintingParams);
            if (callback) {
                elizaLogger.info(
                    `Successfully minted NFT to ${promptData.recipient} with transaction Hash: ${transferResp.hash}`
                );
                callback({
                    text: `Successfully minted NFT to ${promptData.recipient} with transaction Hash: ${transferResp.hash}`,
                    content: {
                        success: true,
                        hash: transferResp.hash,
                        recipient: transferResp.to,
                        tokenUri: transferResp.tokenUri,
                    },
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error during minting the NFT:", error);
            if (callback) {
                callback({
                    text: `Error minting the NFT: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send a golden cat to 0x742d35Cc6634C0532925a3b844Bc454e4438f44",
                    action: "MINT_NFT",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "NFT successfully minted to 0x742d35Cc6634C0532925a3b844Bc454e4438f44 \nTransaction Hash: 0x1234567890",
                    action: "MINT_NFT",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "Send a cake to 0x742d35Cc6634C0532925a3b844Bc454e4438f44",
                    action: "MINT_NFT",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "NFT successfully minted to 0x742d35Cc6634C0532925a3b844Bc454e4438f44 \nTransaction Hash: 0x1234567890",
                    action: "MINT_NFT",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "Send a fabolus car to 0x742d35Cc6634C0532925a3b844Bc454e4438f44",
                    action: "MINT_NFT",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "NFT successfully minted to 0x742d35Cc6634C0532925a3b844Bc454e4438f44 \nTransaction Hash: 0x1234567890",
                    action: "MINT_NFT",
                },
            },
        ],
    ],
};
