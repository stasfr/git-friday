import { Command } from 'commander';
import { profileConfigSetupAction } from '@/cli/profile/config/setup/profileConfigSetupAction.js';

export interface ProfileConfigSetupCommandOption {
  profileName: string;
}

export function useProfileConfigSetupCommand(profileConfigCommand: Command) {
  profileConfigCommand
    .command('setup')
    .description('Step-by-step profile configuration setup')
    .argument('<profile>', 'Name of user profile')
    .action(async (profileName: string) => {
      const options: ProfileConfigSetupCommandOption = { profileName };
      await profileConfigSetupAction(options);
    });
}
