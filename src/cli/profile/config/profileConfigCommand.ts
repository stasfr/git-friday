import { Command } from 'commander';

import { useProfileConfigListCommand } from '@/cli/profile/config/list/profileConfigListCommand.js';
import { useProfileConfigSetCommand } from '@/cli/profile/config/set/profileConfigSetCommand.js';
import { useProfileConfigGetCommand } from '@/cli/profile/config/get/profileConfigGetCommand.js';
import { useProfileConfigSetupCommand } from '@/cli/profile/config/setup/profileConfigSetupCommand.js';

export function useProfileConfigCommand(profileCommand: Command) {
  const profileConfigCommand = profileCommand
    .command('config')
    .description('Manage profile configuration settings');

  useProfileConfigListCommand(profileConfigCommand);
  useProfileConfigSetCommand(profileConfigCommand);
  useProfileConfigGetCommand(profileConfigCommand);
  useProfileConfigSetupCommand(profileConfigCommand);
}
