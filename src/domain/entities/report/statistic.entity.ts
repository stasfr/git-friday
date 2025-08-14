interface StatisticEntityProps {
  promptTokens: number;
  completionTokens: number;
}

export class StatisticEntity {
  private _promptTokens: number;

  private _completionTokens: number;

  get promptTokens(): number {
    return this._promptTokens;
  }

  get completionTokens(): number {
    return this._completionTokens;
  }

  get totalTokens(): number {
    return this._promptTokens + this._completionTokens;
  }

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

  public static from(props: StatisticEntityProps): StatisticEntity {
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
}
