import { generateChatResponse, generateContent, analyzeText } from '../openai';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import OpenAI from 'openai';

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'Mocked response content',
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

// Mock database
vi.mock('../db', () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
      }),
    }),
  },
}));

describe('OpenAI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateChatResponse', () => {
    it('should generate a chat response', async () => {
      const messages = [
        { role: 'user' as const, content: 'Hello AI' },
      ];
      
      const response = await generateChatResponse(messages);
      
      expect(response).toBe('Mocked response content');
    });

    it('should add system prompt when provided', async () => {
      const messages = [
        { role: 'user' as const, content: 'Hello AI' },
      ];
      
      const options = {
        systemPrompt: 'You are a helpful assistant',
      };
      
      await generateChatResponse(messages, options);
      
      // Check that OpenAI was called with the correct messages
      const openaiInstance = OpenAI as unknown as vi.Mock;
      expect(openaiInstance).toHaveBeenCalled();
    });
  });

  describe('generateContent', () => {
    it('should generate content with the specified prompt', async () => {
      const prompt = 'Write a blog post about AI';
      
      const response = await generateContent(prompt);
      
      expect(response.content).toBe('Mocked response content');
    });

    it('should use the appropriate system prompt based on content type', async () => {
      const prompt = 'Write a blog post about AI';
      const options = {
        type: 'blog' as const,
        tone: 'professional' as const,
      };
      
      await generateContent(prompt, options);
      
      // Check that OpenAI was called with appropriate parameters
      const openaiInstance = OpenAI as unknown as vi.Mock;
      expect(openaiInstance).toHaveBeenCalled();
    });
  });

  describe('analyzeText', () => {
    it('should analyze text with default options', async () => {
      // Setup mock for JSON response
      const mockOpenAIInstance = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      sentiment: 'positive',
                      score: 0.8,
                    }),
                  },
                },
              ],
            }),
          },
        },
      };
      
      OpenAI.mockImplementation(() => mockOpenAIInstance);
      
      const text = 'I love this product!';
      const result = await analyzeText(text);
      
      expect(result).toHaveProperty('sentiment');
      expect(result).toHaveProperty('score');
    });
  });
});