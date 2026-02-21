import { Command } from 'commander';

import { profileRun } from '@/cli/profile/run/profileRunCommand.js';

export function profile(program: Command) {
  const profileCommand = program
    .command('profile')
    .description('Manage and execute user profiles');

  profileRun(profileCommand);
}
