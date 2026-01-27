import type { AppConfig } from '@/config/config.types.js';

export function loadAppConfig() {
  const openRouterApiKey = process.env.OPEN_ROUTER_API_KEY;

  if (!openRouterApiKey) {
    throw new Error(
      'Missing required environment variable: OPEN_ROUTER_API_KEY',
    );
  }

  const aiCompletionModel = process.env.AI_COMPLETION_MODEL;

  if (!aiCompletionModel) {
    throw new Error(
      'Missing required environment variable: AI_COMPLETION_MODEL',
    );
  }

  return {
    openRouterApiKey,
    aiCompletionModel,
  } satisfies AppConfig;
}
