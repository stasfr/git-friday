import { Command, Option } from 'commander';
import { runAction } from '@/cli/run/runAction.js';

export interface RunCommandOption {
  profile: string | undefined;
  gitLog: boolean;
  statistics: boolean;
  disableOutput: boolean;
}

export function useRunCommand(command: Command) {
  command
    .command('run')
    .description('Run user profile')
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
    .option('-p, --profile <profileName>', 'Profile name to delete')
    .action(async (options: RunCommandOption) => {
      await runAction(options);
    });
}
