import { Command, Option } from 'commander';
import { runAction } from '@/cli/run/runAction.js';

export interface RunCommandOption {
  profileName: string | undefined;
  gitLog: boolean;
}

export function useRunCommand(command: Command) {
  command
    .command('run')
    .description('Run user profile')
    .argument('[profile]', 'Name of user profile')
    .addOption(
      new Option(
        '-g, --git-log',
        'Prompt for custom git log command even if configured in profile',
      ).default(false),
    )
    .action(
      async (
        profileName: string | undefined,
        cmdOptions: { gitLog?: boolean },
      ) => {
        const options: RunCommandOption = {
          profileName,
          gitLog: cmdOptions.gitLog ?? false,
        };
        await runAction(options);
      },
    );
}
