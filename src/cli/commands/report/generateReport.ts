import { LlmService } from '@/services/llm.service.js';
import { appConfig } from '@/config/config.js';

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

export async function generateReport(command: GenerateReportCommand) {
  const { sourceCommits, gitCommandParams } = command;

  if (sourceCommits.length === 0) {
    throw new Error('Cannot generate a report from an empty list of commits.');
  }

  const llmService = new LlmService({
    openRouterApiKey: appConfig.openRouterApiKey,
  });

  const completionResult = await llmService.getReportBody(
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
