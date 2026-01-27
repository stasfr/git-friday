import type { AppConfig } from '@/config/config.types.js';
import type { ILocalization } from '@/types/localization.js';

const EnNotifications = {
  searchCommits: 'Searching for commits...',
  optionsAuthorsCurrentUserError:
    "option '--authors <authors...>' cannot be used with option '--current-user'",
  noCommitsFoundError: 'No commits found for the specified criteria',
  commitsFound: 'Commits found',
  generateReport: 'Generating report...',
  llmEmptyResponse: 'Got empty response from Llm Provider',
  reportGenerateSuccess: 'Report generated successfully',
  promptTokens: 'Prompt Tokens',
  completionTokens: 'Completion Tokens',
  totalTokens: 'Total Tokens',
  report: 'Report:',
  statistics: 'Statistics:',
  errorOccured: 'An error occurred',
} as const;

const RuNotifications = {
  searchCommits: 'Получение списка коммитов...',
  optionsAuthorsCurrentUserError:
    "опция '--authors <authors...>' не может быть использована с опцией '--current-user'",
  noCommitsFoundError: 'Нет коммитов для указанных критерий',
  commitsFound: 'Коммиты получены',
  generateReport: 'Создание отчета...',
  llmEmptyResponse: 'Получен пустой ответ от LLM',
  reportGenerateSuccess: 'Отчет успешно создан',
  promptTokens: 'Токены на промпт',
  completionTokens: 'Токены на ответ',
  totalTokens: 'Всего токенов',
  report: 'Отчет:',
  statistics: 'Статистика:',
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
