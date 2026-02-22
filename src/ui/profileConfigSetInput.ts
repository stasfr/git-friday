import { input } from '@inquirer/prompts';

import { ExtendedError } from '@/errors/ExtendedError.js';

import type { IEditableProfileConfigKeys } from '@/cli/profile/profileTypes.js';

interface ProfileConfigSetInputOptions {
  value: string | undefined;
  key: IEditableProfileConfigKeys;
  command: string;
}

function validateConfigValue(key: IEditableProfileConfigKeys, value: string) {
  if (key === 'gitLogCommand') {
    if (
      typeof value !== 'string' ||
      value.trim() === '' ||
      isNaN(Number(value)) === false
    ) {
      return 'Command must be a valid string';
    }
  }

  if (key === 'aiCompletionModel') {
    if (
      typeof value !== 'string' ||
      value.trim() === '' ||
      isNaN(Number(value)) === false
    ) {
      return 'Model name must be a string';
    }
  }

  return true;
}

export async function profileConfigSetInput(
  options: ProfileConfigSetInputOptions,
) {
  let newValue = options.value;

  if (newValue !== undefined) {
    const validationResult = validateConfigValue(options.key, newValue);

    if (validationResult !== true) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: `Invalid ${options.key} value`,
        command: options.command,
        service: null,
        hint: validationResult,
      });
    }
  } else {
    newValue = await input({
      message: `Enter value for ${options.key}:`,
      validate: (val) => validateConfigValue(options.key, val),
    });
  }

  return newValue;
}
