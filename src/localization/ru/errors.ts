import type { IErrorLocalization } from '@/localization/localizationTypes.js';

export const errors = {
  failedToCheckForUpdates: 'Не удалось проверить наличие обновлений',
  errorWord: 'Ошибка',
  failedToGetConfigForLocalization:
    'Не удалось получить конфигурацию приложения, в качестве языка по умолчанию был выбран английский.',
  errorOccured: 'Произошла ошибка',
  noCommitsFound: 'Нет коммитов для указанных критериев',
  gotEmptyResponseFromLlm: 'Получен пустой ответ от LLM',
} satisfies IErrorLocalization;
