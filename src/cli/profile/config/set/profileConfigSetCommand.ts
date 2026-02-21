import { Command, Argument } from 'commander';
import { profileConfigSetAction } from '@/cli/profile/config/set/profileConfigSetAction.js';

import type { IEditableProfileConfigKeys } from '@/cli/profile/profileTypes.js';

export interface ProfileConfigSetCommandOption {
  profileName: string;
  key: IEditableProfileConfigKeys;
  value: string;
}

export function useProfileConfigSetCommand(profileConfigCommand: Command) {
  profileConfigCommand
    .command('set')
    .description('Set configuration settings for the profile')
    .argument('<profile>', 'Name of user profile')
    .addArgument(
      new Argument('<key>', 'Configuration key to set').choices([
        'gitLogCommand',
        'aiCompletionModel',
      ]),
    )
    .argument('<value>', 'Value to set for the key')
    .action(
      async (
        profileName: string,
        key: IEditableProfileConfigKeys,
        value: string,
      ) => {
        const options: ProfileConfigSetCommandOption = {
          profileName,
          key,
          value,
        };
        await profileConfigSetAction(options);
      },
    );
}
