import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';
import { select, confirm } from '@inquirer/prompts';

import { profileNameSelect } from '@/ui/profileNameSelect.js';

import { ProfileService } from '@/cli/profile/profileService.js';
import { ExtendedError } from '@/errors/ExtendedError.js';

import type { ProfilePromptAddCommandOption } from '@/cli/profile/prompt/add/profilePromptAddCommand.js';

type IPromptType = 'system' | 'user';

export async function profilePromptAddAction(
  options: ProfilePromptAddCommandOption,
) {
  const sourcePath = path.resolve(process.cwd(), options.file);
  try {
    await fs.access(sourcePath, constants.R_OK);
  } catch {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: `Cannot read file at path: ${sourcePath}`,
      command: 'profile prompt add',
      service: null,
      hint: 'Ensure the file exists and you have read permissions',
    });
  }

  let promptType: IPromptType;
  if (options.system) {
    promptType = 'system';
  } else if (options.user) {
    promptType = 'user';
  } else {
    promptType = await select({
      message: 'Which prompt would you like to add?',
      choices: [
        { name: 'System Prompt', value: 'system' },
        { name: 'User Prompt', value: 'user' },
      ],
    });
  }

  const profileName = await profileNameSelect({
    profile: options.profile,
    command: 'profile prompt add',
  });

  const profileService = new ProfileService({ profileName });

  let fileExists = false;
  if (promptType === 'system') {
    fileExists = (await profileService.hasSystemPromptFile()) === true;
  } else {
    fileExists = (await profileService.hasUserPromptFile()) === true;
  }

  if (fileExists) {
    const shouldOverwrite = await confirm({
      message: `The ${promptType} prompt already exists in profile "${profileName}". Do you want to overwrite it?`,
      default: false,
    });

    if (!shouldOverwrite) {
      console.log('Operation cancelled.');
      return;
    }
  }

  if (promptType === 'system') {
    await profileService.importSystemPrompt(sourcePath);
  } else {
    await profileService.importUserPrompt(sourcePath);
  }

  console.log(
    `Successfully added ${promptType} prompt to profile "${profileName}".`,
  );
}
