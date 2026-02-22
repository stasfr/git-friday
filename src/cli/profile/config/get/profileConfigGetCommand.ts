import { Command, Option } from 'commander';
import { profileConfigGetAction } from '@/cli/profile/config/get/profileConfigGetAction.js';

import type { IEditableProfileConfigKeys } from '@/cli/profile/profileTypes.js';

export interface ProfileConfigGetCommandOption {
  profile: string | undefined;
  key: IEditableProfileConfigKeys;
}

export function useProfileConfigGetCommand(profileConfigCommand: Command) {
  profileConfigCommand
    .command('get')
    .description('Get profile configuration value by key')
    .option('-p, --profile <profileName>', 'Profile name')
    .addOption(
      new Option('-k, --key <key>', 'Configuration key to get').choices([
        'gitLogCommand',
        'aiCompletionModel',
      ]),
    )
    .action(async (options: ProfileConfigGetCommandOption) => {
      await profileConfigGetAction(options);
    });
}
