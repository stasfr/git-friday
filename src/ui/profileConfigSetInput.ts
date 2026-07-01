import { text, isCancel } from '@clack/prompts';

import { aiCompletionModelSelect } from '@/ui/aiCompletionModelSelect.js';
import { CommandExecutionError } from '@/errors/Errors.js';

import type { IEditableProfileConfigKeys } from '@/cli/profile/profileTypes.js';

interface ProfileConfigSetInputOptions {
  value: string | undefined;
  key: IEditableProfileConfigKeys;
}

function validateConfigValue(
  key: IEditableProfileConfigKeys,
  value: string | undefined,
) {
  if (value === undefined) {
    return 'Value cannot be empty';
  }

  if (key === 'gitLogCommand') {
    if (
      typeof value !== 'string' ||
      value.trim() === '' ||
      isNaN(Number(value)) === false
    ) {
      return 'Command must be a valid string';
    }
  }

  if (key === 'gitDiffCommand') {
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

  return undefined;
}

export async function profileConfigSetInput(
  options: ProfileConfigSetInputOptions,
) {
  let newValue = options.value;

  if (newValue !== undefined) {
    const validationResult = validateConfigValue(options.key, newValue);

    if (validationResult !== undefined) {
      throw new CommandExecutionError({
        message: `Invalid ${options.key} value`,
        hint: validationResult,
      });
    }
  } else {
    if (options.key === 'aiCompletionModel') {
      newValue = await aiCompletionModelSelect();
    } else {
      const inputValue = await text({
        message: `Enter value for ${options.key}:`,
        validate: (val) => validateConfigValue(options.key, val),
      });

      if (isCancel(inputValue)) {
        console.log('Operation cancelled');
        process.exit(0);
      }

      newValue = inputValue;
    }
  }

  return newValue;
}
