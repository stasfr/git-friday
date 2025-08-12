interface StatisticEntityProps {
  promptTokens: number;
  completionTokens: number;
}

export interface IStatisticValue {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export class StatisticEntity {
  private _promptTokens: number;

  private _completionTokens: number;

  private constructor(props: StatisticEntityProps) {
    this._promptTokens = props.promptTokens;
    this._completionTokens = props.completionTokens;
  }

  public static create(): StatisticEntity {
    return new StatisticEntity({
      promptTokens: 0,
      completionTokens: 0,
    });
  }

  public static from(props: Omit<IStatisticValue, 'totalTokens'>): StatisticEntity {
    return new StatisticEntity({
      promptTokens: props.promptTokens,
      completionTokens: props.completionTokens,
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

  public get statistics(): IStatisticValue {
    return {
      promptTokens: this._promptTokens,
      completionTokens: this._completionTokens,
      totalTokens: this.calculateTotalTokens(),
    };
  }
}
