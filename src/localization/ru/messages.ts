import type { IMessagesLocalization } from '@/localization/localization.types.js';

export const messages = {
  creatingGitLogCommand: 'Создание git log команды...',
  gitLogCommandCreated: 'Git log команда создана',
  searchingForCommits: 'Получение списка коммитов...',
  noCommitsFound: 'Нет коммитов для указанных критериев',
  commitsFounded: 'Коммиты получены',
  generatingChangelog: 'Создание changelog...',
  gotEmptyResponseFromLlm: 'Получен пустой ответ от LLM',
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
