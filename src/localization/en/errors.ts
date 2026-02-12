import type { IErrorLocalization } from '@/localization/localizationTypes.js';

export const errors = {
  failedToCheckForUpdates: 'Failed to check for updates',
  errorWord: 'Error',
  failedToGetConfigForLocalization:
    'Failed to get application config, used English language as default',
  errorOccured: 'An error occured',
  noCommitsFound: 'No commits found for the specified criteria',
  gotEmptyResponseFromLlm: 'Got empty response from Llm Provider',
  // config service errors
  configFileIsEmpty: 'Config file is empty',
  configFileIsNotValidJson: 'Config file is not a valid JSON',
  configFileMissingAiCompletionModel:
    'Config file is missing aiCompletionModel property',
  invalidAiCompletionModelValue: 'Invalid aiCompletionModel value',
  invalidAppLocalizationValue:
    'Invalid appLocalization value. Supported values: en, ru',
  unsupportedOperatingSystem: 'Unsupported operating system',
  invalidConfigFileStructure: 'Invalid config file structure',
} satisfies IErrorLocalization;
