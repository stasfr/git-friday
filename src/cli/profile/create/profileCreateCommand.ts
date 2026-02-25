import { Command } from 'commander';
import { profileCreateAction } from '@/cli/profile/create/profileCreateAction.js';

export function useProfileCreateCommand(profileCommand: Command) {
  profileCommand
    .command('create')
    .description('Create a new profile')
    .action(async () => {
      await profileCreateAction();
    });
}
