import type { AppConfig } from '@/config/config.types.js';
import type { ILocalization } from '@/types/localization.js';

const EnNotifications = {
  gitLogCommandCreation: 'Creating git log command...',
  gitLogCommandCreated: 'Git log command created',
  searchCommits: 'Searching for commits...',
  noCommitsFoundError: 'No commits found for the specified criteria',
  commitsFound: 'Commits found',
  generatePrText: 'Generating Pull Request text...',
  llmEmptyResponse: 'Got empty response from Llm Provider',
  prTextGenerateSuccess: 'Pull Request text generated successfully',
  promptTokens: 'Prompt',
  completionTokens: 'Completion',
  totalTokens: 'Total',
  prText: 'Pull Request text:',
  statistics: 'Tokens Usage Statistics:',
  errorOccured: 'An error occurred',
} as const;

const RuNotifications = {
  gitLogCommandCreation: 'Создание git log команды...',
  gitLogCommandCreated: 'Git log команда',
  searchCommits: 'Получение списка коммитов...',
  noCommitsFoundError: 'Нет коммитов для указанных критерий',
  commitsFound: 'Коммиты получены',
  generatePrText: 'Создание текста для пулл реквеста...',
  llmEmptyResponse: 'Получен пустой ответ от LLM',
  prTextGenerateSuccess: 'Текст для пулл реквеста успешно создан',
  promptTokens: 'Промпт',
  completionTokens: 'Ответ',
  totalTokens: 'Всего',
  prText: 'Тест для пулл реквеста:',
  statistics: 'Статистика использования токенов:',
  errorOccured: 'Произошла ошибка',
} as const;

export class PrNotifications {
  private readonly localization: ILocalization;

  constructor(appConfig: AppConfig) {
    this.localization = appConfig.appLocalization;
  }

  public getNotification() {
    switch (this.localization) {
      case 'ru':
        return RuNotifications;
      case 'en':
        return EnNotifications;
    }
  }
}
