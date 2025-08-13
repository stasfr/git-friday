import { ValidationError } from '@/domain/shared/domain.errors.js';

export class GotEmptyGitLog extends ValidationError {
  constructor(payload?: {
    data?: Record<string, unknown>,
    cause?: Error
  }) {
    super({
      fieldName: 'sourceCommits',
      reason: 'Log command response is empty',
      ...payload,
    });

    this.name = 'GotEmptyGitLog';
  }
}

export class NoPatternMatchFound extends ValidationError {
  constructor(payload?: {
    data?: Record<string, unknown>,
    cause?: Error
  }) {
    super({
      fieldName: 'sourceCommits',
      reason: 'No pattern match found in log command response',
      ...payload,
    });

    this.name = 'NoPatternMatchFound';
  }
}
