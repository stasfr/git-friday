import type { IErrorLocalization } from '@/localization/localizationTypes.js';

export const errors = {
  failedToGetConfigForLocalization:
    'Не удалось получить конфигурацию приложения, в качестве языка по умолчанию был выбран английский.',
  errorOccured: 'Произошла ошибка',
  noCommitsFound: 'Нет коммитов для указанных критериев',
  gotEmptyResponseFromLlm: 'Получен пустой ответ от LLM',
} satisfies IErrorLocalization;
