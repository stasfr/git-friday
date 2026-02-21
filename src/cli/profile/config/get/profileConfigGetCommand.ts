import { Command, Argument } from 'commander';
import { profileConfigGetAction } from '@/cli/profile/config/get/profileConfigGetAction.js';

import type { IEditableProfileConfigKeys } from '@/cli/profile/profileTypes.js';

export interface ProfileConfigGetCommandOption {
  profileName: string;
  key: IEditableProfileConfigKeys;
}

export function useProfileConfigGetCommand(profileConfigCommand: Command) {
  profileConfigCommand
    .command('get')
    .description('Get profile configuration value by key')
    .argument('<profile>', 'Name of user profile')
    .addArgument(
      new Argument('<key>', 'Configuration key to get').choices([
        'gitLogCommand',
        'aiCompletionModel',
      ]),
    )
    .action(async (profileName: string, key: IEditableProfileConfigKeys) => {
      const options: ProfileConfigGetCommandOption = {
        profileName,
        key,
      };
      await profileConfigGetAction(options);
    });
}
