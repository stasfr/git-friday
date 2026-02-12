import type { IMessagesLocalization } from '@/localization/localizationTypes.js';

export const messages = {
  creatingGitLogCommand: 'Creating git log command...',
  gitLogCommandCreated: 'Git log command created',
  searchingForCommits: 'Searching for commits...',
  commitsFounded: 'Commits found',
  generatingChangelog: 'Generating changelog...',
  changelogGeneratedSuccessfully: 'Changelog generated successfully',
  promptWord: 'Prompt',
  completionWord: 'Completion',
  totalWord: 'Total',
  changelogWord: 'Changelog:',
  tokenUsageStatisticsTitle: 'Tokens Usage Statistics:',
  generatingPullRequestText: 'Generating Pull Request text...',
  pullRequestTextGeneratedSuccess: 'Pull Request text generated successfully',
  pullRequestTextWord: 'Pull Request text:',
  generatingReport: 'Generating report...',
  reportGeneratedSuccessfully: 'Report generated successfully',
  reportWord: 'Report:',
} satisfies IMessagesLocalization;
