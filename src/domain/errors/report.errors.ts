import { StateConflictError } from '@/domain/shared/domain.errors.js';

export class NotPendingStatusErrors extends StateConflictError {
  constructor(payload: {
    reportId: string;
    data?: Record<string, unknown>;
    cause?: Error;
  }) {
    super({
      entityName: 'Report',
      identifier: payload?.reportId,
      reason: 'Report is not in PENDING state.',
      ...payload,
    });

    this.name = 'NotPendingStatusErrors';
  }
}
