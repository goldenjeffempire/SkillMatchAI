
import { generateContent } from './openai';

interface DevResponse {
  code?: string;
  explanation?: string;
  suggestions?: string[];
}

export async function generateDevResponse(
  prompt: string,
  systemPrompt: string
): Promise<DevResponse> {
  try {
    const { content } = await generateContent(prompt, {
      type: "code",
      context: systemPrompt,
    });

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating dev response:", error);
    throw new Error("Failed to generate development response");
  }
}
