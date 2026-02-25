import { select, confirm } from '@inquirer/prompts';

import { profileNameSelect } from '@/ui/profileNameSelect.js';

import { FsService } from '@/services/fsService.js';
import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfilePromptAddCommandOption } from '@/cli/profile/prompt/add/profilePromptAddCommand.js';

type IPromptType = 'system' | 'user';

export async function profilePromptAddAction(
  options: ProfilePromptAddCommandOption,
) {
  const fsService = new FsService();
  await fsService.checkIfFileExists(options.file);

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
    await profileService.importSystemPrompt(options.file);
  } else {
    await profileService.importUserPrompt(options.file);
  }

  console.log(
    `Successfully added ${promptType} prompt to profile "${profileName}".`,
  );
}
