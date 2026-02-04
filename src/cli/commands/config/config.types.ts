import type { ILocalization } from '@/types/localization.js';

export type ILlmProviders = 'openrouter';

export const LlmProviderKeyNames = new Map<ILlmProviders, string>([
  ['openrouter', 'OPEN_ROUTER_API_KEY'],
]);

export type IOsPaths = {
  data: string;
  config: string;
  cache: string;
  log: string;
  temp: string;
};

export type IFileBasedConfig = {
  llmProvider: ILlmProviders;
  aiCompletionModel: string;
  appLocalization: ILocalization;
};

export type AppConfig = {
  llmProvider: ILlmProviders;
  apiKeyName: string;
  aiCompletionModel: string;
  appLocalization: ILocalization;
};
