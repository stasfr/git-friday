import type { IErrorLocalization } from '@/localization/localizationTypes.js';

export const errors = {
  errorOccured: 'Произошла ошибка',
  noCommitsFound: 'Нет коммитов для указанных критериев',
  gotEmptyResponseFromLlm: 'Получен пустой ответ от LLM',
} satisfies IErrorLocalization;
