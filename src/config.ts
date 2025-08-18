export interface AppConfig {
  openRouterApiKey: string,
  aiCompletionModel: string,
  jsonDbPath: string | null | undefined,
}

export function createConfig(): AppConfig {
  const openRouterApiKey = process.env.OPEN_ROUTER_API_KEY;

  if (!openRouterApiKey) {
    throw new Error('Missing required environment variable: OPEN_ROUTER_API_KEY');
  }

  const aiCompletionModel = process.env.AI_COMPLETION_MODEL;

  if (!aiCompletionModel) {
    throw new Error('Missing required environment variable: AI_COMPLETION_MODEL');
  }

  return {
    openRouterApiKey,
    aiCompletionModel,
    jsonDbPath: process.env.JSONDB_PATH,
  };
}
