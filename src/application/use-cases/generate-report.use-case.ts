import { ReportId } from '@/domain/entities/report/report-id.js';
import { ReportEntity } from '@/domain/entities/report/report.entity.js';
import { StatisticEntity } from '@/domain/entities/report/statistic.entity.js';

import { ReportGenerationParams } from '@/domain/shared/value-objects/report-generation-params.js';

import {
  DomainError,
  InternalDomainError,
  ExternalServiceError,
  ValidationError,
} from '@/domain/shared/domain.errors.js';
import { ErrorResult, Result, type Either } from '@/lib/either.js';

import type { IReportRepository } from '@/domain/repositories/report.repository.interface.js';
import type { ILlmProvider } from '@/domain/services/llm-provider.interface.js';
import type { IdGenerator } from '@/domain/services/id-generator.interface.js';

import type { ReportDto } from '@/application/use-cases/generate-report.dto.js';

interface GenerateReportCommand {
  sourceCommits: readonly string[];
  gitCommandParams: {
    authors?: string[];
    branches?: string[];
    llmModelName: string;
    llmProvider: string;
  };
}

interface GenerateReportUseCaseDependencies {
  llmProvider: ILlmProvider;
  idGenerator: IdGenerator;
  reportRepository: IReportRepository;
}

export class GenerateReportUseCase {
  private readonly dependencyContainer: GenerateReportUseCaseDependencies;

  constructor(dependencyContainer: GenerateReportUseCaseDependencies) {
    this.dependencyContainer = dependencyContainer;
  }

  public async execute(
    command: GenerateReportCommand,
  ): Promise<Either<DomainError, ReportDto>> {
    try {
      const { sourceCommits, gitCommandParams } = command;

      if (sourceCommits.length === 0) {
        throw new ValidationError({
          fieldName: 'sourceCommits',
          reason: 'Cannot generate a report from an empty list of commits.',
        });
      }

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

      const completionResult =
        await this.dependencyContainer.llmProvider.getReportBody(
          sourceCommits.join('\n'),
          generationParams.llmModelName,
        );

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

      const reportDto: ReportDto = {
        body: report.body,
        statistic: {
          completionTokens: report.statistic.completionTokens,
          promptTokens: report.statistic.promptTokens,
          totalTokens: report.statistic.totalTokens,
        },
        error: null,
        saved: false,
      };

      try {
        await this.dependencyContainer.reportRepository.add(report);
        reportDto.saved = true;
      } catch (error: unknown) {
        if (error instanceof DomainError) {
          reportDto.error = error.message;
        }

        reportDto.error =
          error instanceof Error ? error.message : String(error);
      }

      return Result.create(reportDto);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return ErrorResult.create(error);
      }

      return ErrorResult.create(
        new InternalDomainError({ message: `Unknown error: ${String(error)}` }),
      );
    }
  }
}
