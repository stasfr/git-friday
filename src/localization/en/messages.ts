import type { IMessagesLocalization } from '@/localization/localizationTypes.js';

export const messages = {
  creatingGitLogCommand: 'Creating git log command...',
  gitLogCommandCreated: 'Git log command created',
  searchingForCommits: 'Searching for commits...',
  noCommitsFound: 'No commits found for the specified criteria',
  commitsFounded: 'Commits found',
  generatingChangelog: 'Generating changelog...',
  gotEmptyResponseFromLlm: 'Got empty response from Llm Provider',
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
