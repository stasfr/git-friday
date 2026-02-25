import { Command, Option } from 'commander';
import { profileConfigSetAction } from '@/cli/profile/config/set/profileConfigSetAction.js';

import type { IEditableProfileConfigKeys } from '@/cli/profile/profileTypes.js';

export interface ProfileConfigSetCommandOption {
  profile: string | undefined;
  key: IEditableProfileConfigKeys;
  value: string;
}

export function useProfileConfigSetCommand(profileConfigCommand: Command) {
  profileConfigCommand
    .command('set')
    .description('Set configuration settings for the profile')
    .option('-p, --profile <profileName>', 'Profile name')
    .addOption(
      new Option('-k, --key <key>', 'Configuration key to set').choices([
        'gitLogCommand',
        'aiCompletionModel',
      ]),
    )
    .option('-v, --value <value>', 'Value to set for the key')
    .action(async (options: ProfileConfigSetCommandOption) => {
      await profileConfigSetAction(options);
    });
}
