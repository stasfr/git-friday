import type { ILocalization } from '@/types/localization.js';

export type AppConfig = {
  paths: {
    data: string;
    config: string;
    cache: string;
    log: string;
    temp: string;
  };
  openRouterApiKey: string;
  aiCompletionModel: string;
  appLocalization: ILocalization;
};
