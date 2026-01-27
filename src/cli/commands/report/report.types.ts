export type CommandOption = {
  authors?: string[];
  branches?: string[];
  since?: string;
  until?: string;
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
