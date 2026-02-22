import OpenAI from 'openai';

import { ExtendedError } from '@/errors/ExtendedError.js';

interface ILlmServiceOptions {
  aiCompletionModel: string;
  prompts: IPrompts;
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
  private _content: string | null;
  private _usage: IUsageTables | null;

  public constructor(options: ILlmServiceOptions) {
    const { aiCompletionModel, prompts } = options;

    this.client = new OpenAI();
    this.modelName = aiCompletionModel;
    this.prompts = prompts;
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
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: this.prompts.systemPrompt,
        },
        {
          role: 'user',
          content: this.prompts.userPrompt,
        },
      ],
      model: this.modelName,
    });

    if (!completion.choices[0].message.content) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'Got empty response from LLM provider',
        command: null,
        service: 'LlmService',
        hint: 'Check LLM provider key and URL and try again',
      });
    }

    this._content = completion.choices[0].message.content;
    this.formatUsage(completion.usage);
  }
}
