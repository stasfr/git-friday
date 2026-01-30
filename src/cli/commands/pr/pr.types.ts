export type PrCommandOption = {
  range: string;
};

export type IPullRequestBody = {
  body: string;
  statistic: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};
