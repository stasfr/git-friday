import { select } from '@inquirer/prompts';

import { CommandExecutionError } from '@/errors/Errors.js';

import type { IEditableProfileConfigKeys } from '@/cli/profile/profileTypes.js';

interface ProfileConfigKeySelectOptions {
  key: string | undefined;
  command: string;
}

export async function profileConfigKeySelect(
  options: ProfileConfigKeySelectOptions,
) {
  let selectedKey = options.key;
  const allowedKeys = [
    'gitLogCommand',
    'aiCompletionModel',
  ] as const satisfies IEditableProfileConfigKeys[];

  if (!selectedKey) {
    selectedKey = await select({
      message: 'Select a key:',
      choices: allowedKeys.map((name) => ({
        name,
        value: name,
      })),
    });
  }

  if (typeof selectedKey !== 'string' || selectedKey.length === 0) {
    throw new CommandExecutionError({
      message: 'Invalid key selection',
      hint: 'Please select a valid key from the list',
    });
  }

  if (selectedKey !== 'gitLogCommand' && selectedKey !== 'aiCompletionModel') {
    throw new CommandExecutionError({
      message: 'Invalid config key',
      hint: 'Provide valid config key. Supported keys: gitLogCommand, aiCompletionModel',
    });
  }

  return selectedKey;
}
