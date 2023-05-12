import { Tokenizer } from "tiktoken";

export async function countTokens(text: string) {
  try {
    const tokenizer = new Tokenizer();
    return tokenizer.countTokens(text);
  } catch (error) {
    console.error("Error counting tokens:", error);
  }
}
