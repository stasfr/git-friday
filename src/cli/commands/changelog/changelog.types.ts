export type ChangelogCommandOption = {
  sinceRef: string;
};

export type IChangelog = {
  body: string;
  statistic: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};
