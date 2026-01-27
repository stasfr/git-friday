import type { ILocalization } from '@/types/localization.js';

export type AppConfig = {
  openRouterApiKey: string;
  aiCompletionModel: string;
  appLocalization: ILocalization;
};
