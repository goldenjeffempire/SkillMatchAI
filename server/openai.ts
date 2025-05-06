import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";
import { aiContents } from "@shared/schema";
import { db } from "./db";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Constants
const DEFAULT_MODEL = "gpt-4o"; // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_TEMPERATURE = 0.7;

/**
 * Function to generate chatbot responses using OpenAI
 */
export async function generateChatResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  options: {
    systemPrompt?: string;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    userId?: number; // For logging/tracking
  } = {}
): Promise<string> {
  try {
    // Add system prompt if provided
    const allMessages = options.systemPrompt
      ? [
          { role: "system" as const, content: options.systemPrompt },
          ...messages,
        ]
      : messages;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages: allMessages,
      temperature: options.temperature || DEFAULT_TEMPERATURE,
      max_tokens: options.max_tokens || 500,
    });

    const content = response.choices[0].message.content || "I'm not sure how to respond to that.";
    
    // Log to database if userId is provided
    if (options.userId) {
      await db.insert(aiContents).values({
        userId: options.userId,
        type: "chat",
        prompt: messages[messages.length - 1]?.content || '',
        content,
        createdAt: new Date(),
      });
    }

    // Return the generated response
    return content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response.");
  }
}

/**
 * Function to generate content with specific instructions
 */
export async function generateContent(
  prompt: string, 
  options: {
    type?: "blog" | "email" | "social" | "product" | "script" | "code" | "article" | "story";
    tone?: "professional" | "casual" | "enthusiastic" | "informative" | "friendly" | "technical";
    context?: string;
    temperature?: number;
    max_tokens?: number;
    userId?: number;
  } = {}
): Promise<{ content: string; id?: number }> {
  try {
    // Build the system prompt based on content type
    let systemPrompt = "";
    const contentType = options.type || "content";
    const tone = options.tone || "professional";
    
    switch (contentType) {
      case "blog":
        systemPrompt = `You are an expert blog writer. Create an engaging, well-structured blog post with appropriate headings, paragraphs, and a compelling introduction and conclusion. Write in a ${tone} tone.`;
        break;
      case "email":
        systemPrompt = `You are an expert email copywriter. Create a persuasive, concise email with a clear call-to-action and subject line suggestion. Write in a ${tone} tone.`;
        break;
      case "social":
        systemPrompt = `You are a social media expert. Create engaging social media content optimized for sharing, with appropriate hashtags and a conversational style. Write in a ${tone} tone.`;
        break;
      case "product":
        systemPrompt = `You are an expert product copywriter. Create compelling product descriptions that highlight benefits, features, and unique selling points. Write in a ${tone} tone.`;
        break;
      case "script":
        systemPrompt = `You are an expert script writer. Create a conversational, engaging script with clear speaker indications and natural dialogue. Write in a ${tone} tone.`;
        break;
      case "code":
        systemPrompt = `You are an expert software developer. Create clean, well-documented, efficient code with explanatory comments. Write in a ${tone} tone for any explanations.`;
        break;
      case "article":
        systemPrompt = `You are an expert article writer. Create an informative, well-researched article with a clear structure, introduction, body, and conclusion. Write in a ${tone} tone.`;
        break;
      case "story":
        systemPrompt = `You are an expert storyteller. Create an engaging narrative with compelling characters, setting, and plot. Write in a ${tone} tone.`;
        break;
      default:
        systemPrompt = `You are an expert content creator. Create high-quality, engaging content in a ${tone} tone.`;
    }
    
    // Add additional context if provided
    if (options.context) {
      systemPrompt += ` ${options.context}`;
    }

    // Make the API call
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1500,
    });

    const content = response.choices[0].message.content || "Unable to generate content.";
    
    // Save to database if userId is provided
    if (options.userId) {
      const [result] = await db.insert(aiContents).values({
        userId: options.userId,
        type: options.type || "content",
        prompt,
        content,
        createdAt: new Date(),
      }).returning({ id: aiContents.id });
      
      return { content, id: result.id };
    }
    
    return { content };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate content.");
  }
}

/**
 * Function for AI-based text analysis (sentiment, topics, etc.)
 */
export async function analyzeText(
  text: string, 
  options: {
    analysisType?: "sentiment" | "keywords" | "summary" | "readability" | "topics" | "general";
    temperature?: number;
    userId?: number;
  } = {}
): Promise<any> {
  try {
    const analysisType = options.analysisType || "general";
    
    // Build specific system prompts based on analysis type
    let systemPrompt = "";
    switch (analysisType) {
      case "sentiment":
        systemPrompt = "You are an expert at sentiment analysis. Analyze the sentiment of the provided text and return a JSON object with a 'score' from -1 (very negative) to 1 (very positive), 'sentiment' (negative/neutral/positive), and 'explanation' fields.";
        break;
      case "keywords":
        systemPrompt = "You are an expert at keyword extraction. Extract the most important keywords and concepts from the provided text and return a JSON object with 'keywords' (array), 'mainTopics' (array), and 'relevance' (object mapping keywords to relevance scores) fields.";
        break;
      case "summary":
        systemPrompt = "You are an expert at text summarization. Provide a concise summary of the key points in the provided text and return a JSON object with 'summary' (string), 'keyPoints' (array), and 'wordCount' fields.";
        break;
      case "readability":
        systemPrompt = "You are an expert at readability analysis. Analyze the readability of the provided text and return a JSON object with 'readabilityScore' (1-10), 'suggestions' (array), 'complexity' (low/medium/high), and 'demographics' (suitable audience) fields.";
        break;
      case "topics":
        systemPrompt = "You are an expert at topic analysis. Identify the main topics and themes in the provided text and return a JSON object with 'mainTopics' (array), 'subtopics' (object grouped by main topics), and 'distribution' (percentage estimates of content dedicated to each topic) fields.";
        break;
      default:
        systemPrompt = "You are an expert at text analysis. Provide a comprehensive analysis of the provided text and return a JSON object with 'summary', 'sentiment', 'keywords', 'topics', and 'readability' fields.";
    }
    
    // Make the API call
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze the following text: "${text}"` }
      ],
      temperature: options.temperature || 0.3,
      response_format: { type: "json_object" },
    });
    
    const content = response.choices[0].message.content;
    const result = content ? JSON.parse(content) : { error: "Failed to parse analysis" };
    
    // Save to database if userId is provided
    if (options.userId) {
      await db.insert(aiContents).values({
        userId: options.userId,
        type: `analysis_${analysisType}`,
        prompt: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        content: JSON.stringify(result),
        createdAt: new Date(),
      });
    }
    
    return result;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze text.");
  }
}

/**
 * Function to generate AI images using DALL-E
 */
export async function generateImage(
  prompt: string,
  options: {
    size?: "1024x1024" | "1792x1024" | "1024x1792";
    quality?: "standard" | "hd";
    style?: "vivid" | "natural";
    userId?: number;
  } = {}
): Promise<{ url: string; id?: number }> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: options.size || "1024x1024",
      quality: options.quality || "standard",
      style: options.style || "vivid",
    });

    const url = response.data[0].url || "";
    
    // Save to database if userId is provided
    if (options.userId && url) {
      const [result] = await db.insert(aiContents).values({
        userId: options.userId,
        type: "image",
        prompt,
        content: url,
        createdAt: new Date(),
      }).returning({ id: aiContents.id });
      
      return { url, id: result.id };
    }
    
    return { url };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate image.");
  }
}

/**
 * Function to analyze images using GPT-4o vision capabilities
 */
export async function analyzeImage(
  imageData: string, // Base64 encoded image or URL
  options: {
    prompt?: string;
    detailed?: boolean;
    userId?: number;
  } = {}
): Promise<string> {
  try {
    const imageContent = imageData.startsWith('data:') || imageData.startsWith('http') 
      ? imageData 
      : `data:image/jpeg;base64,${imageData}`;
      
    const prompt = options.prompt || (options.detailed 
      ? "Provide a detailed analysis of this image, including objects, people, scenes, colors, moods, and any text visible." 
      : "Describe what you see in this image.");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { 
              type: "image_url", 
              image_url: { url: imageContent }
            }
          ],
        },
      ],
      max_tokens: options.detailed ? 800 : 300,
    });

    const analysis = response.choices[0].message.content || "Unable to analyze the image.";
    
    // Save to database if userId is provided
    if (options.userId) {
      await db.insert(aiContents).values({
        userId: options.userId,
        type: "image_analysis",
        prompt: prompt,
        content: analysis,
        createdAt: new Date(),
      });
    }
    
    return analysis;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze image.");
  }
}

/**
 * Function to create embeddings for semantic search
 */
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.trim(),
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to create embedding.");
  }
}

/**
 * Function to improve/edit/refine existing content
 */
export async function improveContent(
  originalContent: string,
  options: {
    instruction: string;
    temperature?: number;
    userId?: number;
  }
): Promise<string> {
  try {
    const instruction = options.instruction || "Improve this content by making it more engaging, clear, and professional.";
    
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { 
          role: "system", 
          content: `You are an expert content editor. ${instruction} Maintain the original meaning and core information.` 
        },
        { role: "user", content: originalContent }
      ],
      temperature: options.temperature || 0.5,
    });

    const improved = response.choices[0].message.content || originalContent;
    
    // Save to database if userId is provided
    if (options.userId) {
      await db.insert(aiContents).values({
        userId: options.userId,
        type: "content_improvement",
        prompt: instruction,
        content: improved,
        createdAt: new Date(),
      });
    }
    
    return improved;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to improve content.");
  }
}