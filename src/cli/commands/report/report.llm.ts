import OpenAI from 'openai';
import { reportPrompts } from '@/cli/commands/report/report.prompts.js';

import type { AppConfig } from '@/config/config.types.js';

export class ReportLlmService {
  private readonly client: OpenAI;

  public constructor(appConfig: AppConfig) {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: appConfig.openRouterApiKey,
    });
  }

  public async getReportBody(commits: string, modelName: string) {
    const systemPrompt = reportPrompts.getSystemPrompts();
    const userPrompt = reportPrompts.getUserPrompt(commits);

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
      model: modelName,
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
