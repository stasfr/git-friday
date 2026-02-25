import { Command, Option } from 'commander';
import { profilePromptAddAction } from '@/cli/profile/prompt/add/profilePromptAddAction.js';

export interface ProfilePromptAddCommandOption {
  system?: boolean;
  user?: boolean;
  file: string;
  profile?: string;
}

export function useProfilePromptAddCommand(profilePromptCommand: Command) {
  profilePromptCommand
    .command('add')
    .description('Add profile prompt')
    .addOption(
      new Option('-s, --system', 'Add system prompt').conflicts('user'),
    )
    .addOption(new Option('-u, --user', 'Add user prompt').conflicts('system'))
    .addOption(
      new Option(
        '-f, --file <path>',
        'Path to the prompt file',
      ).makeOptionMandatory(true),
    )
    .addOption(new Option('-p, --profile <name>', 'Profile name'))
    .action(async (options: ProfilePromptAddCommandOption) => {
      await profilePromptAddAction(options);
    });
}
