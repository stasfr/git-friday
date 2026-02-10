import OpenAI from 'openai';

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

export function generateUsageTables(
  usage: OpenAI.CompletionUsage | IOpenRouterUsage | undefined,
): IUsageTables {
  if (!usage) {
    return { tokens: null, cost: null };
  }

  const tokensTable: IUsageTable = {
    'Prompt Tokens': usage.prompt_tokens,
    'Completion Tokens': usage.completion_tokens,
    'Total Tokens': usage.total_tokens,
  };

  let costTable: IUsageTable | null = null;

  if ('cost' in usage) {
    costTable = {
      'Total Cost': usage.cost,
    };
  }

  if ('cost_details' in usage) {
    if (!costTable) {
      costTable = {};
    }
    costTable['Inference Cost'] = usage.cost_details.upstream_inference_cost;
    costTable['Prompt Cost'] =
      usage.cost_details.upstream_inference_prompt_cost;
    costTable['Completion Cost'] =
      usage.cost_details.upstream_inference_completions_cost;
  }

  return { tokens: tokensTable, cost: costTable };
}
