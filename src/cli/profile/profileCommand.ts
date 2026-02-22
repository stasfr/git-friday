import { Command } from 'commander';

import { useProfileConfigCommand } from '@/cli/profile/config/profileConfigCommand.js';
import { useProfileCreateCommand } from '@/cli/profile/create/profileCreateCommand.js';
import { useProfileSetupCommand } from '@/cli/profile/setup/profileSetupCommand.js';
import { useProfileListCommand } from '@/cli/profile/list/profileListCommand.js';
import { useProfilePromptCommand } from '@/cli/profile/prompt/profilePromptCommand.js';

export function useProfileCommand(program: Command) {
  const profileCommand = program
    .command('profile')
    .description('Manage and execute user profiles');

  useProfileConfigCommand(profileCommand);
  useProfileCreateCommand(profileCommand);
  useProfileSetupCommand(profileCommand);
  useProfileListCommand(profileCommand);
  useProfilePromptCommand(profileCommand);
}
