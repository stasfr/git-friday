export interface IErrorOptions {
  message: string;
  hint?: string | null;
  cause?: unknown;
}

export abstract class AppError extends Error {
  public readonly hint: string | null;
  public readonly cause?: unknown;

  constructor(options: IErrorOptions) {
    super(options.message);
    this.name = this.constructor.name;
    this.hint = options.hint ?? null;
    this.cause = options.cause;
  }

  toString() {
    let output = `\n${this.name}: ${this.message}`;
    if (this.hint) {
      output += `\nHint: ${this.hint}`;
    }
    return output;
  }
}
