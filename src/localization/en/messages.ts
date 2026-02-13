import type { IMessagesLocalization } from '@/localization/localizationTypes.js';

export const messages = {
  // common words
  causeWord: 'Cause',
  commandWord: 'Command',
  commitCount: 'Commit Count',
  // update notifications
  updateAvailable: 'Update available',
  runWord: 'Run',
  toUpdateWord: 'to update',
  // core commands shared
  generatingChangelog: 'Generating changelog...',
  changelogGeneratedSuccessfully: 'Changelog generated successfully',
  promptWord: 'Prompt',
  completionWord: 'Completion',
  totalWord: 'Total',
  costStatistics: 'Cost Statistics in $',
  changelogWord: 'Changelog:',
  tokenUsageStatisticsTitle: 'Tokens Usage Statistics:',
  generatingPullRequestText: 'Generating Pull Request text...',
  pullRequestTextGeneratedSuccess: 'Pull Request text generated successfully',
  pullRequestTextWord: 'Pull Request text:',
  generatingReport: 'Generating report...',
  reportGeneratedSuccessfully: 'Report generated successfully',
  reportWord: 'Report:',
} satisfies IMessagesLocalization;
