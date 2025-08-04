import OpenAI from 'openai';

import { OPEN_ROUTER_API_KEY, AI_COMPLETION_MODEL } from './config.js';
import { generateReportPrompt } from './prompts.js';

export async function getAiComletion(commits: string): Promise<string | null> {
  if (!OPEN_ROUTER_API_KEY || !AI_COMPLETION_MODEL) {
    throw new Error('OPEN_ROUTER_API_KEY and AI_COMPLETION_MODEL must be set');
  }

  const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: OPEN_ROUTER_API_KEY,
  });

  const prompt = generateReportPrompt(commits);

  const completion = await openrouter.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: prompt,
      },
    ],
    model: AI_COMPLETION_MODEL,
  });

  return completion.choices[0].message.content;
}
