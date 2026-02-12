import type { IErrorLocalization } from '@/localization/localizationTypes.js';

export const errors = {
  failedToGetConfigForLocalization:
    'Failed to get application config, used English language as default',
  errorOccured: 'An error occured',
  noCommitsFound: 'No commits found for the specified criteria',
  gotEmptyResponseFromLlm: 'Got empty response from Llm Provider',
} satisfies IErrorLocalization;
