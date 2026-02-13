import type { IErrorLocalization } from '@/localization/localizationTypes.js';

export const errors = {
  failedToCheckForUpdates: 'Не удалось проверить наличие обновлений',
  errorWord: 'Ошибка',
  unknownError: 'Неизвестная ошибка',
  inServiceWord: 'В сервисе',
  hintWord: 'Совет',
  failedToGetConfigForLocalization:
    'Не удалось получить конфигурацию приложения, в качестве языка по умолчанию был выбран английский.',
  errorOccured: 'Произошла ошибка',
  noCommitsFound: 'Нет коммитов для указанных критериев',
  gotEmptyResponseFromLlm: 'Получен пустой ответ от LLM',
  localizationNotConfigured: 'Локализация не настроена',
  // config service errors
  configFileIsEmpty: 'Файл конфигурации пуст',
  configFileIsNotValidJson: 'Файл конфигурации не является корректным JSON',
  configFileMissingAiCompletionModel:
    'В файле конфигурации отсутствует свойство aiCompletionModel',
  invalidAiCompletionModelValue: 'Недопустимое значение aiCompletionModel',
  invalidAppLocalizationValue:
    'Недопустимое значение appLocalization. Поддерживаемые значения: en, ru',
  unsupportedOperatingSystem: 'Неподдерживаемая операционная система',
  invalidConfigFileStructure: 'Недопустимая структура файла конфигурации',
} satisfies IErrorLocalization;
