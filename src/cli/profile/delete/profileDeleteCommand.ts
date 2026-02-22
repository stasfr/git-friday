import { Command } from 'commander';
import { profileDeleteAction } from '@/cli/profile/delete/profileDeleteAction.js';

export interface ProfileDeleteOptions {
  profile?: string;
}

export function useProfileDeleteCommand(profileCommand: Command) {
  profileCommand
    .command('delete')
    .description('Delete an existing profile')
    .option('-p, --profile <profileName>', 'Profile name to delete')
    .action(async (options) => {
      await profileDeleteAction(options);
    });
}
