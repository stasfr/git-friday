import type { AppConfig } from '@/services/config/config.types.js';
import type { ILocalization } from '@/types/localization.js';

const EnNotifications = {
  gitLogCommandCreation: 'Creating git log command...',
  gitLogCommandCreated: 'Git log command created',
  searchCommits: 'Searching for commits...',
  noCommitsFoundError: 'No commits found for the specified criteria',
  commitsFound: 'Commits found',
  generateChangelog: 'Generating changelog...',
  llmEmptyResponse: 'Got empty response from Llm Provider',
  changelogGenerateSuccess: 'Changelog generated successfully',
  promptTokens: 'Prompt',
  completionTokens: 'Completion',
  totalTokens: 'Total',
  changelog: 'Changelog:',
  statistics: 'Tokens Usage Statistics:',
  errorOccured: 'An error occurred',
} as const;

const RuNotifications = {
  gitLogCommandCreation: 'Создание git log команды...',
  gitLogCommandCreated: 'Git log команда',
  searchCommits: 'Получение списка коммитов...',
  noCommitsFoundError: 'Нет коммитов для указанных критерий',
  commitsFound: 'Коммиты получены',
  generateChangelog: 'Создание changelog...',
  llmEmptyResponse: 'Получен пустой ответ от LLM',
  changelogGenerateSuccess: 'Changelog успешно создан',
  promptTokens: 'Промпт',
  completionTokens: 'Ответ',
  totalTokens: 'Всего',
  changelog: 'Changelog:',
  statistics: 'Статистика использования токенов:',
  errorOccured: 'Произошла ошибка',
} as const;

export class ChangelogNotifications {
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
