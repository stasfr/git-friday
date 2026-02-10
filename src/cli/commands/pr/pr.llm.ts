import OpenAI from 'openai';
import { prPrompts } from '@/cli/commands/pr/pr.prompts.js';

import type { AppConfig } from '@/cli/commands/config/config.types.js';
import type { ILocalizationTypes } from '@/localization/localization.types.js';

export class PrLlmService {
  private readonly client: OpenAI;
  private readonly localization: ILocalizationTypes;
  private readonly modelName: string;

  public constructor(appConfig: AppConfig) {
    this.client = new OpenAI();
    this.localization = appConfig.appLocalization;
    this.modelName = appConfig.aiCompletionModel;
  }

  public async getPrTextBody(commits: string) {
    const systemPrompt = prPrompts.getSystemPrompts(this.localization);
    const userPrompt = prPrompts.getUserPrompt(commits, this.localization);

    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: this.modelName,
    });

    if (!completion.choices[0].message.content) {
      return null;
    }

    const completionResult = {
      content: completion.choices[0].message.content,
      promptTokens: completion.usage?.prompt_tokens ?? 0,
      completionTokens: completion.usage?.completion_tokens ?? 0,
    };

    return completionResult;
  }
}
