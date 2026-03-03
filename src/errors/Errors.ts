import { AppError } from './AppError.js';

import type { IErrorOptions } from './AppError.js';

/**
 * Validation error — the user provided invalid data.
 */
export class ValidationError extends AppError {
  constructor(options: IErrorOptions) {
    super(options);
  }
}

/**
 * Resource not found error (file, profile, directory).
 */
export class NotFoundError extends AppError {
  constructor(options: IErrorOptions) {
    super(options);
  }
}

/**
 * Configuration error — problems with config.json or other settings.
 */
export class ConfigError extends AppError {
  constructor(options: IErrorOptions) {
    super(options);
  }
}

/**
 * Command execution error — problem at the CLI command level.
 */
export class CommandExecutionError extends AppError {
  constructor(options: IErrorOptions) {
    super(options);
  }
}

/**
 * External service error — LLM, Git, file system.
 */
export class ExternalServiceError extends AppError {
  public readonly service: string;

  constructor(options: IErrorOptions & { service: string }) {
    super(options);
    this.service = options.service;
  }

  override toString() {
    let output = `\n${this.name} (${this.service}): ${this.message}`;
    if (this.hint) {
      output += `\nHint: ${this.hint}`;
    }
    return output;
  }
}
