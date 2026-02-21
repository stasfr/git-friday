import { Command } from 'commander';
import { runAction } from '@/cli/run/runAction.js';

export interface RunCommandOption {
  profileName: string | undefined;
}

export function useRunCommand(command: Command) {
  command
    .command('run')
    .description('Run user profile')
    .argument('[profile]', 'Name of user profile')
    .action(async (profileName: string | undefined) => {
      const options: RunCommandOption = { profileName };
      await runAction(options);
    });
}
