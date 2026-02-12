import type { IMessagesLocalization } from '@/localization/localizationTypes.js';

export const messages = {
  updateAvailable: 'Доступно обновление',
  runWord: 'Выполните',
  toUpdateWord: 'для обновления',
  creatingGitLogCommand: 'Создание git log команды...',
  gitLogCommandCreated: 'Git log команда создана',
  searchingForCommits: 'Получение списка коммитов...',
  commitsFounded: 'Коммиты получены',
  generatingChangelog: 'Создание changelog...',
  changelogGeneratedSuccessfully: 'Changelog успешно создан',
  promptWord: 'Промпт',
  completionWord: 'Ответ',
  totalWord: 'Всего',
  changelogWord: 'Changelog:',
  tokenUsageStatisticsTitle: 'Статистика использования токенов:',
  generatingPullRequestText: 'Создание текста для пулл реквеста...',
  pullRequestTextGeneratedSuccess: 'Текст для пулл реквеста успешно создан',
  pullRequestTextWord: 'Текст для пулл реквеста:',
  generatingReport: 'Создание отчета...',
  reportGeneratedSuccessfully: 'Отчет успешно создан',
  reportWord: 'Отчет:',
} satisfies IMessagesLocalization;
