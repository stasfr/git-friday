import { Command } from 'commander';

import { profileConfigListAction } from '@/cli/profile/config/list/profileConfigListAction.js';

export interface ProfileConfigListCommandOption {
  profileName: string;
}

export function useProfileConfigListCommand(profileConfigCommand: Command) {
  profileConfigCommand
    .command('list')
    .description('List all profile configuration settings')
    .argument('<profile>', 'Name of user profile')
    .action(async (profileName: string) => {
      const options: ProfileConfigListCommandOption = { profileName };
      await profileConfigListAction(options);
    });
}
