import { Command } from 'commander';

import { useProfileConfigCommand } from '@/cli/profile/config/profileConfigCommand.js';
import { useProfileCreateCommand } from '@/cli/profile/create/profileCreateCommand.js';
import { useProfileSetupCommand } from '@/cli/profile/setup/profileSetupCommand.js';

export function useProfileCommand(program: Command) {
  const profileCommand = program
    .command('profile')
    .description('Manage and execute user profiles');

  useProfileConfigCommand(profileCommand);
  useProfileCreateCommand(profileCommand);
  useProfileSetupCommand(profileCommand);
}
