import OpenAI from 'openai';

export class OpenAIService {
  private client: OpenAI | null = null;

  initialize(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async *streamChatCompletion(messages: Array<{role: string, content: string}>, model: string = 'gpt-4o-mini') {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please set your API key in settings.');
    }

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: messages as any,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield content;
        }
      }
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      if (error.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      } else if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.status === 500) {
        throw new Error('OpenAI server error. Please try again later.');
      }
      throw new Error(`API Error: ${error.message || 'Unknown error occurred'}`);
    }
  }

  async translateMessage(message: string, targetLanguage: string): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Translate the following message to ${targetLanguage}. Only return the translation, no additional text.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || message;
    } catch (error) {
      console.error('Translation error:', error);
      return message;
    }
  }
}

export const openAIService = new OpenAIService();