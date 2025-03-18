export function base64ToFile(base64Data: string, filename: string): File {
    // Remove the data:image/png;base64 prefix if it exists
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");

    // Create a buffer from the base64 string
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Create a File object
    const file = new File([imageBuffer], filename, { type: "image/png" });

    return file;
}