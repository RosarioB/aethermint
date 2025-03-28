import * as viemChains from "viem/chains";
import neynarClient from "./neynar";
import { WalletProvider } from "@elizaos-plugins/plugin-evm";
import { elizaLogger } from "@elizaos/core";
import { normalize } from "viem/ens";

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

export async function getRecipientAddress(
    recipient: string,
    walletProvider: WalletProvider
) {
    let recipientAddress: string;
    try {
        if (recipient.startsWith("@")) {
            const username = recipient.slice(1);
            const userResponse = await neynarClient.lookupUserByUsername({
                username,
            });
            recipientAddress =
                userResponse.user.verified_addresses.primary.eth_address;
        } else if (recipient.endsWith(".eth")) {
            const ensAddress = await walletProvider
                .getPublicClient("mainnet")
                .getEnsAddress({
                    name: normalize(recipient),
                });
            recipientAddress = ensAddress as string;
        } else {
            recipientAddress = recipient;
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
            throw new Error(
                `Invalid recipient address: ${recipientAddress}. Must be a valid Ethereum address.`
            );
        }
        elizaLogger.info(
            `Resolved recipient address: ${recipientAddress} for recipient: ${recipient}`
        );
        return recipientAddress;
    } catch (error) {
        elizaLogger.error("Error resolving recipient address:", error);
        throw error;
    }
}
