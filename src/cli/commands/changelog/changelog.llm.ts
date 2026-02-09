import OpenAI from 'openai';
import { changelogPrompts } from '@/cli/commands/changelog/changelog.prompts.js';

import type { AppConfig } from '@/cli/commands/config/config.types.js';
import type { ILocalizationTypes } from '@/localization/localization.types.js';

export class ChangelogLlmService {
  private readonly client: OpenAI;
  private readonly localization: ILocalizationTypes;
  private readonly modelName: string;

  public constructor(appConfig: AppConfig) {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: appConfig.apiKey,
    });
    this.localization = appConfig.appLocalization;
    this.modelName = appConfig.aiCompletionModel;
  }

  public async getChangelogBody(commits: string) {
    const systemPrompt = changelogPrompts.getSystemPrompts(this.localization);
    const userPrompt = changelogPrompts.getUserPrompt(
      commits,
      this.localization,
    );

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
