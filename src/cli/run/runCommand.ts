import { Command, Option } from 'commander';
import { runAction } from '@/cli/run/runAction.js';

interface RunCmdOptions {
  gitLog: boolean;
  statistics: boolean;
  disableOutput: boolean;
}

export interface RunCommandOption {
  profileName: string | undefined;
  gitLog: boolean;
  statistics: boolean;
  disableOutput: boolean;
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
    .addOption(
      new Option(
        '-s, --statistics',
        'Show usage statistics after generation (tokens, cost). Based on provider response',
      ).default(false),
    )
    .addOption(
      new Option(
        '--disable-output',
        'Disable llm repospone output in command line',
      ).default(false),
    )
    .action(
      async (profileName: string | undefined, cmdOptions: RunCmdOptions) => {
        const options: RunCommandOption = {
          profileName,
          gitLog: cmdOptions.gitLog,
          statistics: cmdOptions.statistics,
          disableOutput: cmdOptions.disableOutput,
        };
        await runAction(options);
      },
    );
}
