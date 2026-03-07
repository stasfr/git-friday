import OpenAI from 'openai';

import { ExternalServiceError } from '@/errors/Errors.js';
import { getErrorMessage, getErrorStatus } from '@/errors/errorHelpers.js';

interface ILlmServiceOptions {
  aiCompletionModel: string;
  prompts: IPrompts;
  context: IContext;
}

interface IContext {
  commits?: string;
  diff?: string;
  another?: string;
}

interface IPrompts {
  systemPrompt: string;
  userPrompt: string;
}

interface IOpenRouterUsage extends OpenAI.CompletionUsage {
  cost: number;
  is_byok: boolean;
  prompt_tokens_details: {
    cached_tokens: number;
    cache_write_tokens: number;
    audio_tokens: number;
    video_tokens: number;
  };
  cost_details: {
    upstream_inference_cost: number;
    upstream_inference_prompt_cost: number;
    upstream_inference_completions_cost: number;
  };
  completion_tokens_details: {
    reasoning_tokens: number;
    image_tokens: number;
  };
}

type IUsageTable = Record<string, number>;

export interface IUsageTables {
  tokens: IUsageTable | null;
  cost: IUsageTable | null;
}

export class LlmService {
  private readonly client: OpenAI;
  private readonly modelName: string;
  private readonly prompts: IPrompts;
  private readonly context: IContext;
  private _content: string | null;
  private _usage: IUsageTables | null;

  public constructor(options: ILlmServiceOptions) {
    const { aiCompletionModel, prompts, context } = options;

    this.client = new OpenAI();
    this.modelName = aiCompletionModel;
    this.prompts = prompts;
    this.context = context;
    this._content = null;
    this._usage = null;
  }

  get content() {
    return this._content;
  }

  get usage() {
    return this._usage;
  }

  private formatUsage(
    completionUsage: IOpenRouterUsage | OpenAI.CompletionUsage | undefined,
  ) {
    if (!completionUsage) {
      this._usage = { tokens: null, cost: null };
      return;
    }

    const tokensTable: IUsageTable = {
      ['Prompt Tokens']: completionUsage.prompt_tokens,
      ['Completion Tokens']: completionUsage.completion_tokens,
      ['Total Tokens']: completionUsage.total_tokens,
    };

    let costTable: IUsageTable | null = null;

    if ('cost' in completionUsage) {
      costTable = {
        ['Total Cost']: completionUsage.cost,
      };
    }

    if ('cost_details' in completionUsage) {
      if (!costTable) {
        costTable = {};
      }
      costTable['Inference Cost'] =
        completionUsage.cost_details.upstream_inference_cost;
      costTable['Prompt Cost'] =
        completionUsage.cost_details.upstream_inference_prompt_cost;
      costTable['Completion Cost'] =
        completionUsage.cost_details.upstream_inference_completions_cost;
    }

    this._usage = { tokens: tokensTable, cost: costTable };
  }

  public async getCompletion() {
    try {
      const systemPrompt = this.prompts.systemPrompt;
      let userPrompt = this.prompts.userPrompt;
      const { commits, diff, another } = this.context;

      if (commits) {
        userPrompt += `\n\nCommits:\n${commits}`;
      }

      if (diff) {
        userPrompt += `\n\nDiff:\n${diff}`;
      }

      if (another) {
        userPrompt += `\n\nAnother:\n${another}`;
      }

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
        throw new ExternalServiceError({
          service: 'LLM Provider',
          message: 'Got empty response from LLM provider',
          hint: 'Check LLM provider key and URL and try again',
        });
      }

      this._content = completion.choices[0].message.content;
      this.formatUsage(completion.usage);
    } catch (error) {
      if (error instanceof ExternalServiceError) {
        throw error;
      }

      const errorMessage = getErrorMessage(error);
      const status = getErrorStatus(error);

      if (
        errorMessage.includes('API key') ||
        errorMessage.includes('authentication')
      ) {
        throw new ExternalServiceError({
          service: 'LLM Provider',
          message: 'Authentication failed. Invalid or missing API key.',
          hint: 'Check your API key configuration.',
          cause: error,
        });
      }

      if (errorMessage.includes('rate limit') || status === 429) {
        throw new ExternalServiceError({
          service: 'LLM Provider',
          message: 'Rate limit exceeded. Please try again later.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: 'LLM Provider',
        message: `Failed to get completion from LLM provider.\nOriginal error: ${errorMessage}`,
        cause: error,
      });
    }
  }
}
