import type { ILocalizationTypes } from '@/localization/localization.types.js';

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
  appLocalization: ILocalizationTypes;
};

export type AppConfig = {
  llmProvider: ILlmProviders;
  apiKey: string;
  aiCompletionModel: string;
  appLocalization: ILocalizationTypes;
};
