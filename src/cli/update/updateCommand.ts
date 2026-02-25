import { Command } from 'commander';

import { useUpdateCheckCommand } from '@/cli/update/check/updateCheckCommand.js';

export function useUpdateCommand(command: Command) {
  const updateCommand = command.command('update').description('Manage updates');

  useUpdateCheckCommand(updateCommand);
}
