import { ReportId } from '@/domain/entities/report/report-id.js';
import { StatisticId } from '@/domain/entities/statistic/statistic-id.js';

interface StatisticEntityProps {
  id: StatisticId;
  reportId: ReportId;
  promptTokens: number;
  completionTokens: number;
  createdAt: Date;
}

export class StatisticEntity {
  private readonly _id: StatisticId;

  private readonly _reportId: ReportId;

  private _promptTokens: number;

  private _completionTokens: number;

  private readonly _createdAt: Date;

  private constructor(props: StatisticEntityProps) {
    this._id = props.id;
    this._reportId = props.reportId;
    this._promptTokens = props.promptTokens;
    this._completionTokens = props.completionTokens;
    this._createdAt = props.createdAt;
  }

  static create(payload: {
    id: StatisticId;
    reportId: ReportId
  }): StatisticEntity {
    const { id, reportId } = payload;

    return new StatisticEntity({
      id,
      reportId,
      promptTokens: 0,
      completionTokens: 0,
      createdAt: new Date(),
    });
  }

  public incrementPromptTokens(amount: number): void {
    this._promptTokens += amount;
  }

  public incrementCompletionTokens(amount: number): void {
    this._completionTokens += amount;
  }

  private calculateTotalTokens(): number {
    return this._promptTokens + this._completionTokens;
  }

  public get statistics(): {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } {
    return {
      promptTokens: this._promptTokens,
      completionTokens: this._completionTokens,
      totalTokens: this.calculateTotalTokens(),
    };
  }
}
