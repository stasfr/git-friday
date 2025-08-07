import { ReportId } from '@/domain/entities/report/report-id.js';
import { StatisticEntity } from '@/domain/entities/report/statistic.entity.js';

import { StateConflictError } from '@/domain/shared/domain.errors.js';

import { CommitLog } from '@/domain/shared/value-objects/commit-log.js';
import { ReportGenerationParams } from '@/domain/shared/value-objects/report-generation-params.js';

export type ReportStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

interface ReportEntityProps {
  id: ReportId;
  statistic: StatisticEntity;
  generationParams: ReportGenerationParams;
  sourceCommits: CommitLog;
  modelName: string;
  status: ReportStatus;
  body: string | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  version: number;
}

export class ReportEntity {
  private readonly _id: ReportId;

  private readonly _statistic: StatisticEntity;

  private readonly _generationParams: ReportGenerationParams;

  private readonly _sourceCommits: CommitLog;

  private readonly _modelName: string;

  private _status: ReportStatus;

  private _body: string | null;

  private _error: string | null;

  private _version: number;

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

  private constructor(props: ReportEntityProps) {
    this._id = props.id;
    this._statistic = props.statistic;
    this._generationParams = props.generationParams;
    this._sourceCommits = props.sourceCommits;
    this._modelName = props.modelName;
    this._status = props.status;
    this._body = props.body;
    this._error = props.error;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._version = props.version;
  }

  static create(props: {
    id: ReportId;
    statistic: StatisticEntity;
    generationParams: ReportGenerationParams;
    sourceCommits: CommitLog;
    modelName: string;
  }): ReportEntity {
    return new ReportEntity({
      ...props,
      status: 'PENDING',
      body: null,
      error: null,
      createdAt: new Date(),
      updatedAt: null,
      version: 1,
    });
  }

  public complete(
    body: string,
    promptTokens: number,
    completionTokens: number,
  ): void {
    if (this._status !== 'PENDING') {
      throw new StateConflictError({
        entityName: 'Report',
        identifier: this._id.value,
        reason: 'Report is not in PENDING state.',
      });
    }

    this._status = 'COMPLETED';
    this._body = body;
    this._statistic.incrementPromptTokens(promptTokens);
    this._statistic.incrementCompletionTokens(completionTokens);
    this._updatedAt = new Date();
    this._version++;
  }

  public fail(error: string): void {
    if (this._status !== 'PENDING') {
      throw new StateConflictError({
        entityName: 'Report',
        identifier: this._id.value,
        reason: 'Report is not in PENDING state.',
      });
    }

    this._status = 'FAILED';
    this._error = error;
    this._updatedAt = new Date();
    this._version++;
  }
}
