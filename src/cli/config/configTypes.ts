export type IOsPaths = {
  data: string;
  config: string;
  cache: string;
  log: string;
  temp: string;
};

export type ILocalizationTypes = 'en' | 'ru';

export type IFileBasedConfig = {
  aiCompletionModel: string;
  llmPromptsLocalization?: ILocalizationTypes;
};

export type AppConfig = {
  aiCompletionModel: string;
  llmPromptsLocalization: ILocalizationTypes | null;
};
