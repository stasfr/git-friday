import { select } from '@inquirer/prompts';

import { firstLetterUpperCase } from '@/utils/stringUtils.js';
import { profileNameSelect } from '@/ui/profileNameSelect.js';

import { ProfileService } from '@/cli/profile/profileService.js';
import { ExtendedError } from '@/errors/ExtendedError.js';

import type { ProfilePromptReadCommandOption } from '@/cli/profile/prompt/read/profilePromptReadCommand.js';

type IPromptType = 'system' | 'user';

export async function profilePromptReadAction(
  options: ProfilePromptReadCommandOption,
) {
  let promptType: IPromptType;
  if (options.system) {
    promptType = 'system';
  } else if (options.user) {
    promptType = 'user';
  } else {
    promptType = await select({
      message: 'Which prompt would you like to read?',
      choices: [
        { name: 'System Prompt', value: 'system' },
        { name: 'User Prompt', value: 'user' },
      ],
    });
  }

  const profileName = await profileNameSelect({
    profile: options.profile,
    command: 'profile prompt read',
  });

  const profileService = new ProfileService({ profileName });

  let fileExists: true | ExtendedError;
  if (promptType === 'system') {
    fileExists = await profileService.checkIfSystemPromptExists();
  } else {
    fileExists = await profileService.checkIfUserPromptExists();
  }

  if (fileExists instanceof ExtendedError) {
    throw fileExists;
  }

  let prompt = 'Not found';

  if (promptType === 'system') {
    prompt = await profileService.getProfileSystemPrompt();
  } else if (promptType === 'user') {
    prompt = await profileService.getProfileUserPrompt();
  }

  console.log(
    `${firstLetterUpperCase(promptType)} prompt for profile "${profileName}"`,
  );
  console.log('\n' + prompt + '\n');
}
