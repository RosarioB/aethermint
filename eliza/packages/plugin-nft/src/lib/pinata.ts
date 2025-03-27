import { elizaLogger } from "@elizaos/core";
import { PinataSDK } from "pinata-web3";
import { config } from "./config";

export const pinata = new PinataSDK({
    pinataJwt: config.pinata_jwt,
    pinataGateway: config.pinata_gateway_url,
});

export const uploadImageToPinata = async (file: File) => {
    const { IpfsHash: imageHash } = await pinata.upload.file(file);
    return imageHash;
};

export const uploadJsonToPinata = async (
    name: string,
    description: string,
    imageHash: string
) => {
    const jsonName = `${name
        .slice(0, 20)
        .replace(/\s/g, "_")}_${Date.now()}.json`;
    const { IpfsHash: jsonHash } = await pinata.upload.json(
        {
            name: name,
            description: description,
            image: `ipfs://${imageHash}`,
        },
        {
            pinType: "async",
            metadata: {
                name: jsonName,
            },
        }
    );

    elizaLogger.info(
        `Successfully uploaded JSON ${jsonName} to Pinata with hash: ${jsonHash}`
    );
    return jsonHash;
};
