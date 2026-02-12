import type { IErrorLocalization } from '@/localization/localizationTypes.js';

export const errors = {
  errorOccured: 'An error occured',
  noCommitsFound: 'No commits found for the specified criteria',
  gotEmptyResponseFromLlm: 'Got empty response from Llm Provider',
} satisfies IErrorLocalization;
