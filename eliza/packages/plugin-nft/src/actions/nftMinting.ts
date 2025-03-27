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
    SupportedChain,
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
import { config } from "../lib/config.js";
import { createNft } from "../lib/api.js";
import { getChainKeyById } from "../lib/utils.js";

const ERC721_ADDRESS = config.erc721_address as `0x${string}`;

const erc721Abi = parseAbi([
    "function totalSupply() public view returns (uint256)",
    "function safeMint(address to, string memory uri) public returns (uint256)",
]);

export class NftMintingAction {
    private currentChainKey: SupportedChain;

    constructor(private walletProvider: WalletProvider) {
        this.currentChainKey = getChainKeyById(
            walletProvider.getCurrentChain().id
        );
    }

    async mint(params: NftMintingParams): Promise<NftMintingTransaction> {
        elizaLogger.info(
            `Minting NFT with TokenURI ${params.jsonHash} to ${params.recipient}`
        );
        const currentChain = this.walletProvider.getCurrentChain();
        const account = this.walletProvider.account;
        const walletClient = this.walletProvider.getWalletClient(
            this.currentChainKey
        );
        try {
            const totalSupply = await this.walletProvider
                .getPublicClient(this.currentChainKey)
                .readContract({
                    address: ERC721_ADDRESS,
                    abi: erc721Abi,
                    functionName: "totalSupply",
                    args: [],
                });
            const txHash = await walletClient.writeContract({
                address: ERC721_ADDRESS,
                abi: erc721Abi,
                functionName: "safeMint",
                args: [params.recipient as `0x${string}`, params.jsonHash],
                chain: currentChain,
                account: account,
            });

            elizaLogger.info(
                `Successfully minted NFT n. ${totalSupply} to ${params.recipient} with transaction Hash: ${txHash}`
            );

            const imageUrl = `https://${config.pinata_gateway_url}/ipfs/${params.imageHash}`;
            const jsonUrl = `ipfs://${params.jsonHash}`;

            await createNft({
                id: totalSupply.toString(),
                name: params.name,
                description: params.description,
                imageUrl: imageUrl,
                jsonIpfsUrl: jsonUrl,
                owner: params.recipient,
            });

            return {
                id: totalSupply.toString(),
                hash: txHash,
                from: walletClient.account.address,
                to: params.recipient,
                tokenUri: params.jsonHash,
                imageUrl,
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

        const nftMintingParams: NftMintingParams = {
            jsonHash: jsonHash,
            recipient: promptData.recipient,
            name: promptData.name,
            description: promptData.description,
            imageHash: imageHash,
        };

        try {
            const transferResp = await action.mint(nftMintingParams);
            const currentChain = walletProvider.getCurrentChain();
            const txUrl = `${currentChain.blockExplorers.default.url}/tx/${transferResp.hash}`;

            if (callback) {
                callback({
                    text: `Successfully minted the NFT of ${promptData.description} to ${promptData.recipient}. Transaction: ${txUrl}`,
                    content: {
                        success: true,
                        nftId: transferResp.id,
                        hash: transferResp.hash,
                        recipient: transferResp.to,
                        tokenUri: transferResp.tokenUri,
                        imageUrl: transferResp.imageUrl,
                        txUrl: txUrl,
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
                    text: "Successfully minted NFT of ID 1 to 0x742d35Cc6634C0532925a3b844Bc454e4438f44. Check the transaction at this URL:https://sepolia.basescan.org/tx/0x625f1ccf068bb71c5b0a385297f7a0bfa5a32b23f4d08c3e2c41158ac468e3a2 ---imageUrl:https://apricot-obvious-xerinae-783.mypinata.cloud/ipfs/bafybeidwnwsaadwtoregkjdfvaivmaslxragxzkjwk2zgp7jkw4th2xzm6---",
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
                    text: "Successfully minted NFT of ID 2 to 0x742d35Cc6634C0532925a3b844Bc454e4438f44. Check the transaction at this URL:https://sepolia.basescan.org/tx/0x625f1ccf068bb71c5b0a385297f7a0bfa5a32b23f4d08c3e2c41158ac468e3a2 ---imageUrl:https://apricot-obvious-xerinae-783.mypinata.cloud/ipfs/bafybeidwnwsaadwtoregkjdfvaivmaslxragxzkjwk2zgp7jkw4th2xzm6---",
                    action: "MINT_NFT",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "Create a fabolus car and send it to 0x742d35Cc6634C0532925a3b844Bc454e4438f44",
                    action: "MINT_NFT",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Successfully minted NFT of ID 3 to 0x742d35Cc6634C0532925a3b844Bc454e4438f44. Check the transaction at this URL:https://sepolia.basescan.org/tx/0x625f1ccf068bb71c5b0a385297f7a0bfa5a32b23f4d08c3e2c41158ac468e3a2 ---imageUrl:https://apricot-obvious-xerinae-783.mypinata.cloud/ipfs/bafybeidwnwsaadwtoregkjdfvaivmaslxragxzkjwk2zgp7jkw4th2xzm6---",
                    action: "MINT_NFT",
                },
            },
        ],
    ],
};
