import { loadEnvFile } from 'node:process';
import { Command, Option } from 'commander';
import { runAction } from '@/cli/run/runAction.js';

export interface RunCommandOption {
  profile: string | undefined;
  gitLog: boolean;
  statistics: boolean;
  cliOutput: boolean;
  fileOutput: boolean | string;
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
        '-c, --cli-output',
        'Write llm response in command line',
      ).default(false),
    )
    .addOption(
      new Option(
        '-f, --file-output [fileName]',
        'Write llm response in file. Note: The file will be saved in the current directory.',
      ).default(false),
    )
    .option('-p, --profile <profileName>', 'Profile name')
    .hook('preAction', () => {
      loadEnvFile();
    })
    .action(async (options: RunCommandOption) => {
      await runAction(options);
    });
}
