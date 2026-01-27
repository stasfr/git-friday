export type CommandOption = {
  authors?: string[];
  branches?: string[];
  currentUser: boolean;
};

export type IReport = {
  body: string;
  statistic: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};
