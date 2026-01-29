export type CommandOption = {
  authors?: string[];
  branches?: string[];
  all: boolean;
  since?: string;
  until?: string;
  currentUser: boolean;
  range?: string;
  sinceRef?: string;
};

export type IReport = {
  body: string;
  statistic: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};
