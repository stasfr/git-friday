import { Command } from 'commander';

import { useProfileConfigCommand } from '@/cli/profile/config/profileConfigCommand.js';

export function useProfileCommand(program: Command) {
  const profileCommand = program
    .command('profile')
    .description('Manage and execute user profiles');

  useProfileConfigCommand(profileCommand);
}
