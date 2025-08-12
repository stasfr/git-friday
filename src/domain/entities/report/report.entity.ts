import { ReportId } from '@/domain/entities/report/report-id.js';
import { StatisticEntity, type IStatisticValue } from '@/domain/entities/report/statistic.entity.js';

import { NotPendingStatusErrors } from '@/domain/errors/report.errors.js';

import { CommitLog } from '@/domain/shared/value-objects/commit-log.js';
import { ReportGenerationParams } from '@/domain/shared/value-objects/report-generation-params.js';

export type ReportStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

interface ReportEntityProps {
  id: ReportId;
  statistic: StatisticEntity;
  generationParams: ReportGenerationParams;
  sourceCommits: CommitLog;
  status: ReportStatus;
  body: string | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export class ReportEntity {
  private readonly _id: ReportId;

  private readonly _statistic: StatisticEntity;

  private readonly _generationParams: ReportGenerationParams;

  private readonly _sourceCommits: CommitLog;

  private _status: ReportStatus;

  private _body: string | null;

  private _error: string | null;

  private readonly _createdAt: Date;

  private _updatedAt: Date | null;

  get status(): ReportStatus {
    return this._status;
  }

  get body(): string | null {
    return this._body;
  }

  get error(): string | null {
    return this._error;
  }

  get statistics(): IStatisticValue {
    return this._statistic.statistics;
  }

  private constructor(props: ReportEntityProps) {
    this._id = props.id;
    this._statistic = props.statistic;
    this._generationParams = props.generationParams;
    this._sourceCommits = props.sourceCommits;
    this._status = props.status;
    this._body = props.body;
    this._error = props.error;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: ReportId;
    statistic: StatisticEntity;
    generationParams: ReportGenerationParams;
    sourceCommits: CommitLog;
  }): ReportEntity {
    return new ReportEntity({
      ...props,
      status: 'PENDING',
      body: null,
      error: null,
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  public complete(
    body: string,
    promptTokens: number,
    completionTokens: number,
  ): void {
    if (this._status !== 'PENDING') {
      throw new NotPendingStatusErrors({ reportId: this._id.value });
    }

    this._status = 'COMPLETED';
    this._body = body;
    this._statistic.incrementPromptTokens(promptTokens);
    this._statistic.incrementCompletionTokens(completionTokens);
    this._updatedAt = new Date();
  }

  public fail(error: string): void {
    if (this._status !== 'PENDING') {
      throw new NotPendingStatusErrors({ reportId: this._id.value });
    }

    this._status = 'FAILED';
    this._error = error;
    this._updatedAt = new Date();
  }
}
