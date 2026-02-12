export type ILocalizationTypes = 'en' | 'ru';

export interface IErrorLocalization {
  failedToGetConfigForLocalization: string;
  failedToCheckForUpdates: string;
  errorWord: string;
  errorOccured: string;
  noCommitsFound: string;
  gotEmptyResponseFromLlm: string;
  // config service errors
  configFileIsEmpty: string;
  configFileIsNotValidJson: string;
  configFileMissingAiCompletionModel: string;
  invalidAiCompletionModelValue: string;
  invalidAppLocalizationValue: string;
  unsupportedOperatingSystem: string;
  invalidConfigFileStructure: string;
  localizationNotConfigured: string;
}

export interface IMessagesLocalization {
  // common words
  causeWord: string;
  // update notifications
  updateAvailable: string;
  runWord: string;
  toUpdateWord: string;
  // core commands shared
  creatingGitLogCommand: string;
  gitLogCommandCreated: string;
  searchingForCommits: string;
  commitsFounded: string;
  // statistics related
  tokenUsageStatisticsTitle: string;
  promptWord: string;
  completionWord: string;
  totalWord: string;
  // changelog command related
  generatingChangelog: string;
  changelogGeneratedSuccessfully: string;
  changelogWord: string;
  // pr command related
  generatingPullRequestText: string;
  pullRequestTextGeneratedSuccess: string;
  pullRequestTextWord: string;
  // report command related
  generatingReport: string;
  reportGeneratedSuccessfully: string;
  reportWord: string;
}

export interface ILocalizationList
  extends IErrorLocalization, IMessagesLocalization {}

export type ILocalizationKey =
  | keyof IErrorLocalization
  | keyof IMessagesLocalization;
