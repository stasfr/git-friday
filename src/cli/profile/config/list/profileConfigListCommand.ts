import { Command } from 'commander';

import { profileConfigListAction } from '@/cli/profile/config/list/profileConfigListAction.js';

export interface ProfileConfigListCommandOption {
  profile: string | undefined;
}

export function useProfileConfigListCommand(profileConfigCommand: Command) {
  profileConfigCommand
    .command('list')
    .description('List all profile configuration settings')
    .option('-p, --profile <profileName>', 'Profile name')
    .action(async (options: ProfileConfigListCommandOption) => {
      await profileConfigListAction(options);
    });
}
