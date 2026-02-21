import { Command } from 'commander';

import { useProfileRunCommand } from '@/cli/profile/run/profileRunCommand.js';

export function useProfileCommand(program: Command) {
  const profileCommand = program
    .command('profile')
    .description('Manage and execute user profiles');

  useProfileRunCommand(profileCommand);
}
