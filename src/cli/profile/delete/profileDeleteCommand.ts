import { Command } from 'commander';
import { profileDeleteAction } from '@/cli/profile/delete/profileDeleteAction.js';

export interface ProfileDeleteOptions {
  profile: string | undefined;
}

export function useProfileDeleteCommand(profileCommand: Command) {
  profileCommand
    .command('delete')
    .description('Delete an existing profile')
    .option('-p, --profile <profileName>', 'Profile name')
    .action(async (options) => {
      await profileDeleteAction(options);
    });
}
