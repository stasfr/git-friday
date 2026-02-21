export interface IOsPaths {
  data: string;
  config: string;
  cache: string;
  log: string;
  temp: string;
}

export type ILocalizationTypes = 'en' | 'ru';

export interface IEmptyFileBasedConfig {
  aiCompletionModel: null;
  llmPromptsLocalization: null;
}

export interface IFileBasedConfig {
  aiCompletionModel: string;
  llmPromptsLocalization?: ILocalizationTypes;
}

export interface AppConfig {
  aiCompletionModel: string;
  llmPromptsLocalization: ILocalizationTypes | null;
}
