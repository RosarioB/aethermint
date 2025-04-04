export const STYLE =""; /* "futuristic with vibrant colors"; */

export const getImagePromptInput = (content: string) => {
    return `You are tasked with generating an image prompt based on a content and a specified style.
            Your goal is to create a detailed and vivid image prompt that captures the essence of the content while incorporating an appropriate subject based on your analysis of the content.\n\nYou will be given the following inputs:\n<content>\n${content}\n</content>\n\n<style>\n${STYLE}\n</style>\n\nA good image prompt consists of the following elements:\n\n

            1. Main subject
            2. Detailed description
            3. Style
            4. Lighting
            5. Composition
            6. Quality modifiers

            To generate the image prompt, follow these steps:\n\n1. Analyze the content text carefully, identifying key themes, emotions, and visual elements mentioned or implied.
            \n\n

            2. Determine the most appropriate main subject by:
               - Identifying concrete objects or persons mentioned in the content
               - Analyzing the central theme or message
               - Considering metaphorical representations of abstract concepts
               - Selecting a subject that best captures the content's essence

            3. Determine an appropriate environment or setting based on the content's context and your chosen subject.

            4. Decide on suitable lighting that enhances the mood or atmosphere of the scene.

            5. Choose a color palette that reflects the content's tone and complements the subject.

            6. Identify the overall mood or emotion conveyed by the content.

            7. Plan a composition that effectively showcases the subject and captures the content's essence.

            8. Incorporate the specified style into your description, considering how it affects the overall look and feel of the image.

            9. Use concrete nouns and avoid abstract concepts when describing the main subject and elements of the scene.

            Construct your image prompt using the following structure:\n\n
            1. Main subject: Describe the primary focus of the image based on your analysis
            2. Environment: Detail the setting or background
            3. Lighting: Specify the type and quality of light in the scene
            4. Colors: Mention the key colors and their relationships
            5. Mood: Convey the overall emotional tone
            6. Composition: Describe how elements are arranged in the frame
            7. Style: Incorporate the given style into the description

            Ensure that your prompt is detailed, vivid, and incorporates all the elements mentioned above while staying true to the content and the specified style. LIMIT the image prompt 50 words or less. \n\nWrite a prompt. Only include the prompt and nothing else.`;
};

export const IMAGE_SYSTEM_PROMPT = `You are an expert in writing prompts for AI art generation. You excel at creating detailed and creative visual descriptions. Incorporating specific elements naturally. Always aim for clear, descriptive language that generates a creative picture. Your output should only contain the description of the image contents, but NOT an instruction like "create an image that..."`;
