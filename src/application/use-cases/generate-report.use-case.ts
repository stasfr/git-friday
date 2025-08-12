import { ReportId } from '@/domain/entities/report/report-id.js';
import { ReportEntity } from '@/domain/entities/report/report.entity.js';
import { StatisticEntity } from '@/domain/entities/report/statistic.entity.js';

import { CommitLog } from '@/domain/shared/value-objects/commit-log.js';
import { ReportGenerationParams } from '@/domain/shared/value-objects/report-generation-params.js';

import { DomainError, InternalDomainError, ExternalServiceError } from '@/domain/shared/domain.errors.js';
import { ErrorResult, Result, type Either } from '@/lib/either.js';

import type { ILlmProvider } from '@/domain/services/llm-provider.interface.js';
import type { IdGenerator } from '@/domain/services/id-generator.interface.js';

interface GenerateReportCommand {
  gitLogOutput: string;
  gitCommandParams: {
    authors: string[];
    branches: string[];
    llmModelName: string;
    llmProvider: string;
  };
}

interface GenerateReportUseCaseDependencies {
  llmProvider: ILlmProvider;
  idGenerator: IdGenerator;
}

export class GenerateReportUseCase {
  private readonly dependencyContainer: GenerateReportUseCaseDependencies;

  constructor(dependencyContainer: GenerateReportUseCaseDependencies) {
    this.dependencyContainer = dependencyContainer;
  }

  public async execute(command: GenerateReportCommand): Promise<Either<DomainError, ReportEntity>> {
    try {
      const {
        gitLogOutput,
        gitCommandParams,
      } = command;

      const sourceCommits = CommitLog.create(gitLogOutput);
      const generationParams = ReportGenerationParams.create({
        authors: gitCommandParams.authors,
        branches: gitCommandParams.branches,
        llmModelName: gitCommandParams.llmModelName,
        llmProvider: gitCommandParams.llmProvider,
      });

      const reportId = ReportId.create(this.dependencyContainer.idGenerator);
      const statistic = StatisticEntity.create();

      const report = ReportEntity.create({
        id: reportId,
        sourceCommits,
        generationParams,
        statistic,
      });

      const completionResult = await this.dependencyContainer.llmProvider.getReportBody(sourceCommits.value, generationParams.llmModelName);

      if (!completionResult) {
        throw new ExternalServiceError({
          serviceName: 'OpenRouter',
          data: { message: 'Got empty response from Llm Provider' },
        });
      }

      report.complete(
        completionResult.content,
        completionResult.promptTokens,
        completionResult.completionTokens,
      );

      return Result.create(report);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return ErrorResult.create(error);
      }

      return ErrorResult.create(new InternalDomainError({ message: `Unknown error: ${String(error)}` }));
    }
  }
}
