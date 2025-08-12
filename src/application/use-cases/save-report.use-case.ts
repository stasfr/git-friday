import { ReportEntity } from '@/domain/entities/report/report.entity.js';

import type { IReportRepository } from '@/domain/repositories/report.repository.interface.js';

import { DomainError, ExternalServiceError } from '@/domain/shared/domain.errors.js';
import { ErrorResult, Result, type Either } from '@/lib/either.js';

interface SaveReportCommand { report: ReportEntity }

interface SaveReportUseCaseDependencies { reportRepository: IReportRepository }

export class SaveReportUseCase {
  private readonly dependencyContainer: SaveReportUseCaseDependencies;

  constructor(dependencyContainer: SaveReportUseCaseDependencies) {
    this.dependencyContainer = dependencyContainer;
  }

  public async execute(command: SaveReportCommand): Promise<Either<DomainError, true>> {
    try {
      const { report } = command;
      await this.dependencyContainer.reportRepository.add(report);

      return Result.create(true);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return ErrorResult.create(error);
      }

      return ErrorResult.create(new ExternalServiceError({
        serviceName: 'Database',
        cause: error instanceof Error
          ? error
          : new Error(String(error)),
      }));
    }
  }
}
