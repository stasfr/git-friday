export type ILocalizationTypes = 'en' | 'ru';

export interface IErrorLocalization {
  errorOccured: string;
}

export interface IMessagesLocalization {
  creatingGitLogCommand: string;
  gitLogCommandCreated: string;
  searchingForCommits: string;
  noCommitsFound: string;
  commitsFounded: string;
  generatingChangelog: string;
  gotEmptyResponseFromLlm: string;
  changelogGeneratedSuccessfully: string;
  promptWord: string;
  completionWord: string;
  totalWord: string;
  changelogWord: string;
  tokenUsageStatisticsTitle: string;
  generatingPullRequestText: string;
  pullRequestTextGeneratedSuccess: string;
  pullRequestTextWord: string;
  generatingReport: string;
  reportGeneratedSuccessfully: string;
  reportWord: string;
}

export interface ILocalizationList
  extends IErrorLocalization, IMessagesLocalization {}

export type ILocalizationKey =
  | keyof IErrorLocalization
  | keyof IMessagesLocalization;
