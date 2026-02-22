import { Command, Option } from 'commander';
import { profilePromptReadAction } from '@/cli/profile/prompt/read/profilePromptReadAction.js';

export interface ProfilePromptReadCommandOption {
  system?: boolean;
  user?: boolean;
  profile?: string;
}

export function useProfilePromptReadCommand(profilePromptCommand: Command) {
  profilePromptCommand
    .command('read')
    .description('Read profile prompt')
    .addOption(
      new Option('-s, --system', 'Read system prompt').conflicts('user'),
    )
    .addOption(new Option('-u, --user', 'Read user prompt').conflicts('system'))
    .addOption(new Option('-p, --profile <name>', 'Profile name'))
    .action(async (options: ProfilePromptReadCommandOption) => {
      await profilePromptReadAction(options);
    });
}
