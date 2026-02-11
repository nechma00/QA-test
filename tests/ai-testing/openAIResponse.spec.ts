import { test, expect } from '@playwright/test';
import OpenAI from 'openai';

test.describe('OpenAI Integration Tests', () => {
  let openai: OpenAI;

  test.beforeAll(async () => {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

        // Skip test if API key is not configured
        if (!process.env.OPENAI_API_KEY) {
          test.skip();
        }
    
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: "Say 'test successful' if you can read this." }
          ],
          max_tokens: 10,
        });
        expect(completion.choices[0].message).toBeDefined();
        expect(completion.choices[0].message.content).toBeTruthy();
        expect(completion.choices[0].finish_reason).toBeDefined();
        
        console.log('OpenAI Response:', completion.choices[0].message.content);
  });

  test('should return accurate response for specific prompt', async () => {
    const prompt = "What is the capital of France?";
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0, // Minimize randomness for non-deterministic testing
    });

    console.log(completion.choices[0].message.content);
    const response = completion.choices[0].message.content;
    expect(response).toContain("Paris");
  });
  
});