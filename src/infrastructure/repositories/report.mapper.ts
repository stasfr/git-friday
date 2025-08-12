import { ReportId } from '@/domain/entities/report/report-id.js';
import { ReportEntity, type ReportStatus } from '@/domain/entities/report/report.entity.js';
import { ReportGenerationParams } from '@/domain/shared/value-objects/report-generation-params.js';
import { CommitLog } from '@/domain/shared/value-objects/commit-log.js';
import { StatisticEntity } from '@/domain/entities/report/statistic.entity.js';

export interface PersistedReport {
  id: string;
  status: ReportStatus;
  body: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string | null;
  generationParams: {
    authors: readonly string[];
    branches: readonly string[];
    since?: Date;
    until?: Date;
    llmModelName: string;
    llmProvider: string;
  }
  sourceCommits: readonly string[];
  statistics: {
    promptTokens: number;
    completionTokens: number;
  }
}

export function toDomain(payload: PersistedReport): ReportEntity {
  const { id, status, body, error, createdAt, updatedAt, generationParams, sourceCommits, statistics } = payload;

  const domainReportId = ReportId.from(id);
  const domainGenerationParams = ReportGenerationParams.create({
    authors: generationParams.authors,
    branches: generationParams.branches,
    since: generationParams.since,
    until: generationParams.until,
    llmModelName: generationParams.llmModelName,
    llmProvider: generationParams.llmProvider,
  });
  const domainSourceCommits = CommitLog.from(sourceCommits);
  const domainStatistics = StatisticEntity.from({
    promptTokens: statistics.promptTokens,
    completionTokens: statistics.completionTokens,
  });

  const report = ReportEntity.from({
    id: domainReportId,
    status,
    body,
    error,
    createdAt: new Date(createdAt),
    updatedAt: updatedAt
      ? new Date(updatedAt)
      : null,
    generationParams: domainGenerationParams,
    sourceCommits: domainSourceCommits,
    statistic: domainStatistics,
  });

  return report;
}

export function toPersistence(report: ReportEntity): PersistedReport {
  const { id, status, body, error, createdAt, updatedAt, generationParams, sourceCommits, statistics } = report;

  const payload: PersistedReport = {
    id,
    status,
    body,
    error,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt
      ? updatedAt.toISOString()
      : null,
    generationParams: {
      authors: generationParams.authors,
      branches: generationParams.branches,
      since: generationParams.since,
      until: generationParams.until,
      llmModelName: generationParams.llmModelName,
      llmProvider: generationParams.llmProvider,
    },
    sourceCommits,
    statistics,
  };

  return payload;
}
