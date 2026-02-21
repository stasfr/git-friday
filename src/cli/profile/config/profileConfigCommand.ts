import { Command } from 'commander';

import { useProfileConfigListCommand } from '@/cli/profile/config/list/profileConfigListCommand.js';
import { useProfileConfigSetCommand } from '@/cli/profile/config/set/profileConfigSetCommand.js';

export function useProfileConfigCommand(profileCommand: Command) {
  const profileConfigCommand = profileCommand
    .command('config')
    .description('Manage profile configuration settings');

  useProfileConfigListCommand(profileConfigCommand);
  useProfileConfigSetCommand(profileConfigCommand);
}
