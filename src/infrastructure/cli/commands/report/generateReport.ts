import { LlmProvider } from '@/infrastructure/providers/llm.provider.js';

export type IReport = {
  body: string;
  statistic: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

export type GenerateReportCommand = {
  sourceCommits: readonly string[];
  gitCommandParams: {
    authors?: string[];
    branches?: string[];
    llmModelName: string;
    llmProvider: string;
  };
};

export async function generateReport(
  command: GenerateReportCommand,
): Promise<IReport> {
  const { sourceCommits, gitCommandParams } = command;

  if (sourceCommits.length === 0) {
    throw new Error('Cannot generate a report from an empty list of commits.');
  }

  const llmProvider = new LlmProvider({
    openRouterApiKey: process.env.OPEN_ROUTER_API_KEY!,
  });

  const completionResult = await llmProvider.getReportBody(
    sourceCommits.join('\n'),
    gitCommandParams.llmModelName,
  );

  if (!completionResult) {
    throw new Error('Got empty response from Llm Provider');
  }

  const report = {
    body: completionResult.content,
    statistic: {
      promptTokens: completionResult.promptTokens,
      completionTokens: completionResult.completionTokens,
      totalTokens:
        completionResult.promptTokens + completionResult.completionTokens,
    },
  } satisfies IReport;

  return report;
}
