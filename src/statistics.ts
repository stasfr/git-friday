const GEMINI_PRO_MILLION_PROMPT_TOKENS_COST = 1.25;
const GEMINI_PRO_MILLION_COMPLETION_TOKENS_CONST = 10;

const privateConstructorKey = Symbol('StatisticsCollector.private');

export class StatisticsCollector {
  #promptTokens = 0;

  #completionTokens = 0;

  private constructor(key: symbol) {
    if (key !== privateConstructorKey) {
      throw new Error('Private constructor access error');
    }
  }

  static create(): StatisticsCollector {
    return new StatisticsCollector(privateConstructorKey);
  }

  public incrementPromptTokens(amount: number): void {
    this.#promptTokens += amount;
  }

  public incrementCompletionTokens(amount: number): void {
    this.#completionTokens += amount;
  }

  private calculateTotalTokens(): number {
    return this.#promptTokens + this.#completionTokens;
  }

  private calculateTotalSumForGeminiPro(): number {
    const promptsCost = (this.#promptTokens / 1000000) * GEMINI_PRO_MILLION_PROMPT_TOKENS_COST;
    const completionCost = (this.#completionTokens / 1000000) * GEMINI_PRO_MILLION_COMPLETION_TOKENS_CONST;

    return promptsCost + completionCost;
  }

  public get statistics(): {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costForGeminiPro: number;
  } {
    return {
      promptTokens: this.#promptTokens,
      completionTokens: this.#completionTokens,
      totalTokens: this.calculateTotalTokens(),
      costForGeminiPro: this.calculateTotalSumForGeminiPro(),
    };
  }
}
