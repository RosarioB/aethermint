export const logWithTimestamp = (text: string) => {
  console.log(`[${new Date().toISOString()}] ${text}`);
};

export const errorWithTimestamp = (text: string, error: any) => {
  console.error(`[${new Date().toISOString()}] ${text}:`, error);
};
