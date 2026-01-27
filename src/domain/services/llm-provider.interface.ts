export interface ICompletionResult {
  content: string;
  promptTokens: number;
  completionTokens: number;
}

export interface ILlmProvider {
  getReportBody(
    commits: string,
    modelName: string,
  ): Promise<ICompletionResult | null>;
  getPullRequestCompletion(
    commits: string,
    modelName: string,
  ): Promise<ICompletionResult | null>;
  getChangeLog(
    commits: string,
    modelName: string,
  ): Promise<ICompletionResult | null>;
}
