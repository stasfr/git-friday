import { Command } from 'commander';
import { profileSetupAction } from '@/cli/profile/setup/profileSetupAction.js';

export interface ProfileSetupCommandOption {
  profile: string | undefined;
}

export function useProfileSetupCommand(profileCommand: Command) {
  profileCommand
    .command('setup')
    .description('Step-by-step profile configuration setup')
    .option('-p, --profile <profileName>', 'Profile name to delete')
    .action(async (options: ProfileSetupCommandOption) => {
      await profileSetupAction(options);
    });
}
