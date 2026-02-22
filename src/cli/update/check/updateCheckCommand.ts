import { Command } from 'commander';

import { updateCheckAction } from '@/cli/update/check/updateCheckAction.js';

export function useUpdateCheckCommand(updateCommand: Command) {
  updateCommand
    .command('check')
    .description('Check for updates')
    .action(async () => {
      await updateCheckAction();
    });
}
