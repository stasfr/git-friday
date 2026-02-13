import OpenAI from 'openai';

import { $l } from '@/localization/localization.js';

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
    [$l('promptTokens')]: usage.prompt_tokens,
    [$l('completionTokens')]: usage.completion_tokens,
    [$l('totalTokens')]: usage.total_tokens,
  };

  let costTable: IUsageTable | null = null;

  if ('cost' in usage) {
    costTable = {
      [$l('totalCost')]: usage.cost,
    };
  }

  if ('cost_details' in usage) {
    if (!costTable) {
      costTable = {};
    }
    costTable[$l('inferenceCost')] = usage.cost_details.upstream_inference_cost;
    costTable[$l('promptCost')] =
      usage.cost_details.upstream_inference_prompt_cost;
    costTable[$l('completionCost')] =
      usage.cost_details.upstream_inference_completions_cost;
  }

  return { tokens: tokensTable, cost: costTable };
}
