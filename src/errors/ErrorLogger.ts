import { AppError } from '@/errors/index.js';

export function formatError(error: unknown) {
  if (error instanceof AppError) {
    return error.toString();
  }

  if (error instanceof Error) {
    return `\nAn unexpected error occurred: ${error.message}\nHint: If the error persists, please create an issue in the repository`;
  }

  return `\nAn unexpected error occurred\nHint: If the error persists, please create an issue in the repository`;
}

export function printError(error: unknown) {
  console.log(formatError(error));
}
