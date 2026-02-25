/**
 * Type guard to check if a value is an Error instance
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Safely extracts the error message from an unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
}

/**
 * Type guard to check if an error has an HTTP status property
 */
export function isHttpError(
  error: unknown,
): error is { status: number } & Record<PropertyKey, unknown> {
  return (
    error != null &&
    typeof error === 'object' &&
    'status' in error &&
    typeof error.status === 'number'
  );
}

/**
 * Safely extracts the HTTP status from an error, returns null if not available
 */
export function getErrorStatus(error: unknown): number | null {
  return isHttpError(error) ? error.status : null;
}

/**
 * Type guard to check if an error has a code property (e.g., Node.js system errors)
 */
export function hasErrorCode(
  error: unknown,
): error is { code: unknown } & Record<PropertyKey, unknown> {
  return error != null && typeof error === 'object' && 'code' in error;
}

/**
 * Safely extracts the error code from an error, returns null if not available
 */
export function getErrorCode(error: unknown): string | null {
  if (!hasErrorCode(error)) {
    return null;
  }
  const code = error.code;
  return typeof code === 'string' ? code : null;
}
