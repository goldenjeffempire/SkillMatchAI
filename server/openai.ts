import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate chatbot responses using OpenAI
export async function generateChatResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  systemPrompt?: string
): Promise<string> {
  try {
    // Add system prompt if provided
    const allMessages = systemPrompt
      ? [
          { role: "system" as const, content: systemPrompt },
          ...messages,
        ]
      : messages;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Return the generated response
    return response.choices[0].message.content || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Sorry, I'm having trouble connecting to my AI services right now. Please try again later.";
  }
}

// Function to generate content with specific instructions
export async function generateContent(
  prompt: string, 
  context: string = "",
  options: {
    temperature?: number;
    max_tokens?: number;
    type?: string;
  } = {}
): Promise<string> {
  try {
    const systemPrompt = options.type 
      ? `You are an expert ${options.type} creator. Create high-quality, engaging ${options.type} based on the user's request. ${context}`
      : `You are an expert content creator. Create high-quality, engaging content based on the user's request. ${context}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
    });

    return response.choices[0].message.content || "Sorry, I couldn't generate content for that prompt.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Sorry, I'm having trouble connecting to my AI services right now. Please try again later.";
  }
}

// Function for AI-based text analysis (sentiment, topics, etc.)
export async function analyzeText(text: string, analysisType: string = "general"): Promise<any> {
  try {
    const systemPrompt = `You are an expert text analyst. Perform a ${analysisType} analysis on the provided text and return your insights.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze the following text: "${text}"` }
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });
    
    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : { error: "Failed to parse analysis" };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return { error: "Failed to analyze text" };
  }
}