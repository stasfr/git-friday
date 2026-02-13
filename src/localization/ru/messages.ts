import type { IMessagesLocalization } from '@/localization/localizationTypes.js';

export const messages = {
  // common words
  causeWord: 'Причина',
  commandWord: 'Команда',
  commitCount: 'Количество коммитов',
  // update notifications
  updateAvailable: 'Доступно обновление',
  runWord: 'Выполните',
  toUpdateWord: 'для обновления',
  generatingChangelog: 'Создание changelog...',
  changelogGeneratedSuccessfully: 'Changelog успешно создан',
  promptWord: 'Промпт',
  completionWord: 'Ответ',
  totalWord: 'Всего',
  costStatistics: 'Стоимость запроса $',
  changelogWord: 'Changelog:',
  tokenUsageStatisticsTitle: 'Статистика использования токенов:',
  generatingPullRequestText: 'Создание текста для пулл реквеста...',
  pullRequestTextGeneratedSuccess: 'Текст для пулл реквеста успешно создан',
  pullRequestTextWord: 'Текст для пулл реквеста:',
  generatingReport: 'Создание отчета...',
  reportGeneratedSuccessfully: 'Отчет успешно создан',
  reportWord: 'Отчет:',
  // tokens table
  promptTokens: 'Токены промпта',
  completionTokens: 'Токены ответа',
  totalTokens: 'Всего токенов',
  // cost table
  totalCost: 'Общая стоимость',
  inferenceCost: 'Стоимость инференса',
  promptCost: 'Стоимость промпта',
  completionCost: 'Стоимость ответа',
} satisfies IMessagesLocalization;
