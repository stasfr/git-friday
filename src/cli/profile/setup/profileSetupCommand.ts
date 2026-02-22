import { Command } from 'commander';
import { profileSetupAction } from '@/cli/profile/setup/profileSetupAction.js';

export interface ProfileSetupCommandOption {
  profileName: string | undefined;
}

export function useProfileSetupCommand(profileCommand: Command) {
  profileCommand
    .command('setup')
    .description('Step-by-step profile configuration setup')
    .argument('[profile]', 'Name of user profile')
    .action(async (profileName: string | undefined) => {
      const options: ProfileSetupCommandOption = {
        profileName,
      };
      await profileSetupAction(options);
    });
}
