interface DomainErrorProps {
  message: string;
  metadata?: Record<string, unknown>;
  cause?: Error;
}

export abstract class DomainError extends Error {
  abstract readonly code: string;

  public readonly metadata?: Record<string, unknown>;

  constructor(props: DomainErrorProps) {
    super(props.message, { cause: props.cause });
    this.metadata = props.metadata;
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';

  constructor(payload: {
    entityName: string;
    identifier: string;
    data?: Record<string, unknown>;
    cause?: Error;
  }) {
    const message = `Entity "${payload.entityName}" with identifier "${payload.identifier}" was not found`;
    const metadata = {
      entityName: payload.entityName,
      identifier: payload.identifier,
      data: payload.data,
    };
    super({
      message,
      metadata,
      cause: payload.cause,
    });
  }
}

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';

  constructor(payload: {
    fieldName: string;
    reason: string;
    data?: Record<string, unknown>;
    cause?: Error;
  }) {
    const message = `Validation failed for field "${payload.fieldName}": ${payload.reason}`;
    const metadata = {
      fieldName: payload.fieldName,
      reason: payload.reason,
      data: payload.data,
    };
    super({
      message,
      metadata,
      cause: payload.cause,
    });
  }
}

export class StateConflictError extends DomainError {
  readonly code = 'STATE_CONFLICT';

  constructor(payload: {
    entityName: string;
    identifier: string;
    reason: string;
    data?: Record<string, unknown>;
    cause?: Error;
  }) {
    const message = `Cannot perform operation on entity "${payload.entityName}" (ID: ${payload.identifier}): ${payload.reason}`;
    const metadata = {
      entityName: payload.entityName,
      identifier: payload.identifier,
      reason: payload.reason,
      data: payload.data,
    };
    super({
      message,
      metadata,
      cause: payload.cause,
    });
  }
}

export class ExternalServiceError extends DomainError {
  readonly code = 'EXTERNAL_SERVICE_ERROR';

  constructor(payload: {
    serviceName: string;
    data?: Record<string, unknown>;
    cause?: Error;
  }) {
    const message = `An error occurred while communicating with the external service: ${payload.serviceName}`;
    const metadata = {
      serviceName: payload.serviceName,
      data: payload.data,
    };
    super({
      message,
      metadata,
      cause: payload.cause,
    });
  }
}

export class ConcurrencyError extends DomainError {
  readonly code = 'CONCURRENCY_ERROR';

  constructor(payload: {
    entityName: string;
    identifier: string;
    data?: Record<string, unknown>;
    cause?: Error;
  }) {
    const message = `A concurrency conflict occurred while updating "${payload.entityName}" with identifier "${payload.identifier}". The data has been modified by another transaction.`;
    const metadata = {
      entityName: payload.entityName,
      identifier: payload.identifier,
      data: payload.data,
    };
    super({
      message,
      metadata,
      cause: payload.cause,
    });
  }
}

export class InternalDomainError extends DomainError {
  readonly code = 'INTERNAL_DOMAIN_ERROR';

  constructor(payload: {
    message: string;
    data?: Record<string, unknown>;
    cause?: Error;
  }) {
    const message = `An internal domain error occurred: ${payload.message}`;
    const metadata = { data: payload.data };
    super({
      message,
      metadata,
      cause: payload.cause,
    });
  }
}
