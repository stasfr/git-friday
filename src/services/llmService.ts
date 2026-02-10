import OpenAI from 'openai';

import type { AppConfig } from '@/cli/commands/config/config.types.js';

interface IPrompts {
  systemPrompt: string;
  userPrompt: string;
}

export class LlmService {
  private readonly client: OpenAI;
  private readonly modelName: string;

  public constructor(appConfig: AppConfig) {
    this.client = new OpenAI();
    this.modelName = appConfig.aiCompletionModel;
  }

  public async getCompletion(prompts: IPrompts) {
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: prompts.systemPrompt,
        },
        {
          role: 'user',
          content: prompts.userPrompt,
        },
      ],
      model: this.modelName,
    });

    if (!completion.choices[0].message.content) {
      return null;
    }

    const completionResult = {
      content: completion.choices[0].message.content,
      usage: completion.usage,
    };

    return completionResult;
  }
}
