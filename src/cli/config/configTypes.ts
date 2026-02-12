import type { ILocalizationTypes } from '@/localization/localizationTypes.js';

export type IOsPaths = {
  data: string;
  config: string;
  cache: string;
  log: string;
  temp: string;
};

export type IFileBasedConfig = {
  aiCompletionModel: string;
  appLocalization: ILocalizationTypes;
};

export type AppConfig = {
  aiCompletionModel: string;
  appLocalization: ILocalizationTypes;
};
