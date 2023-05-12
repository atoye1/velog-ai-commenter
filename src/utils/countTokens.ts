import { OpenAIApi } from "openai";

export async function countTokens(text: string) {
  try {
    const response = await tools.tiktoken({
      texts: [text],
    });
    return response.data.length;
  } catch (error) {
    console.error("Error counting tokens:", error);
  }
}
