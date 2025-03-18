import {
    elizaLogger,
    generateImage,
    generateText,
    IAgentRuntime,
    ModelClass,
} from "@elizaos/core";
import {
    getImagePromptInput,
    IMAGE_SYSTEM_PROMPT,
} from "../templates/imageGenerationTemplate";
import { base64ToFile } from "./utils";
import { uploadImageToPinata as uploadImageOnPinata } from "./pinata";

export const generateAiImage = async (
    /* state: State, */
    runtime: IAgentRuntime,
    imageDescription: string
): Promise<string> => {
    const imagePrompt = await generateText({
        runtime,
        context: getImagePromptInput(imageDescription),
        modelClass: ModelClass.MEDIUM,
        customSystemPrompt: IMAGE_SYSTEM_PROMPT,
    });

    elizaLogger.info("Image prompt received:", imagePrompt);

    const image = await generateImage(
        {
            prompt: imagePrompt,
            width: 1024,
            height: 1024,
            count: 1,
        },
        runtime
    );

    if (image.success && image.data && image.data.length > 0) {
        elizaLogger.info("Image generated successfully");
        const base64Image = image.data[0];
        const filename = `generated_${Date.now()}`;
        return await saveImageOnIpfs(base64Image, filename);
    } else {
        throw new Error("Error generating image");
    }
};

const saveImageOnIpfs = async (base64Image: string, filename: string) => {
    const file = base64ToFile(base64Image, filename);
    const imageHash = await uploadImageOnPinata(file);
    elizaLogger.info(
        "Image:",
        filename,
        "uploaded to IPFS with hash:",
        imageHash
    );
    return imageHash;
};
