import type { AppConfig } from '@/cli/commands/config/config.types.js';
import type { ILocalization } from '@/types/localization.js';

const EnNotifications = {
  gitLogCommandCreation: 'Creating git log command...',
  gitLogCommandCreated: 'Git log command created',
  searchCommits: 'Searching for commits...',
  noCommitsFoundError: 'No commits found for the specified criteria',
  commitsFound: 'Commits found',
  generateReport: 'Generating report...',
  llmEmptyResponse: 'Got empty response from Llm Provider',
  reportGenerateSuccess: 'Report generated successfully',
  promptTokens: 'Prompt',
  completionTokens: 'Completion',
  totalTokens: 'Total',
  report: 'Report:',
  statistics: 'Tokens Usage Statistics:',
  errorOccured: 'An error occurred',
} as const;

const RuNotifications = {
  gitLogCommandCreation: 'Создание git log команды...',
  gitLogCommandCreated: 'Git log команда',
  searchCommits: 'Получение списка коммитов...',
  noCommitsFoundError: 'Нет коммитов для указанных критерий',
  commitsFound: 'Коммиты получены',
  generateReport: 'Создание отчета...',
  llmEmptyResponse: 'Получен пустой ответ от LLM',
  reportGenerateSuccess: 'Отчет успешно создан',
  promptTokens: 'Промпт',
  completionTokens: 'Ответ',
  totalTokens: 'Всего',
  report: 'Отчет:',
  statistics: 'Статистика использования токенов:',
  errorOccured: 'Произошла ошибка',
} as const;

export class ReportNotifications {
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
