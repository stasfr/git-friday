export type AppConfig = {
  openRouterApiKey: string;
  aiCompletionModel: string;
};

const openRouterApiKey = process.env.OPEN_ROUTER_API_KEY;

if (!openRouterApiKey) {
  throw new Error('Missing required environment variable: OPEN_ROUTER_API_KEY');
}

const aiCompletionModel = process.env.AI_COMPLETION_MODEL;

if (!aiCompletionModel) {
  throw new Error('Missing required environment variable: AI_COMPLETION_MODEL');
}

export const appConfig: AppConfig = {
  openRouterApiKey,
  aiCompletionModel,
};
