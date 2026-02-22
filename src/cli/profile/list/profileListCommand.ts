import { Command } from 'commander';
import { profileListAction } from '@/cli/profile/list/profileListAction.js';

export function useProfileListCommand(profileCommand: Command) {
  profileCommand
    .command('list')
    .description('List all profiles')
    .action(async () => {
      await profileListAction();
    });
}
