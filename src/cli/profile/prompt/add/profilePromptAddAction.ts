import { select, confirm, isCancel } from '@clack/prompts';

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
    const selectedPromptType = await select({
      message: 'Which prompt would you like to add?',
      options: [
        { label: 'System Prompt', value: 'system' },
        { label: 'User Prompt', value: 'user' },
      ],
    });

    if (isCancel(selectedPromptType)) {
      console.log('Operation cancelled');
      process.exit(0);
    }

    promptType = selectedPromptType;
  }

  const profileName = await profileNameSelect({
    profile: options.profile,
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
      initialValue: false,
    });

    if (isCancel(shouldOverwrite) || shouldOverwrite === false) {
      console.log('Operation cancelled');
      process.exit(0);
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
