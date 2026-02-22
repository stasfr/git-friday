import { Command } from 'commander';

import { useProfileListCommand } from '@/cli/profile/list/profileListCommand.js';
import { useProfileCreateCommand } from '@/cli/profile/create/profileCreateCommand.js';
import { useProfileSetupCommand } from '@/cli/profile/setup/profileSetupCommand.js';
import { useProfilePromptCommand } from '@/cli/profile/prompt/profilePromptCommand.js';
import { useProfileConfigCommand } from '@/cli/profile/config/profileConfigCommand.js';
import { useProfileDeleteCommand } from '@/cli/profile/delete/profileDeleteCommand.js';

export function useProfileCommand(program: Command) {
  const profileCommand = program
    .command('profile')
    .description('Manage and user profiles');

  useProfileListCommand(profileCommand);
  useProfileCreateCommand(profileCommand);
  useProfileSetupCommand(profileCommand);
  useProfilePromptCommand(profileCommand);
  useProfileConfigCommand(profileCommand);
  useProfileDeleteCommand(profileCommand);
}
