import { Command } from 'commander';
import { profileRunAction } from '@/cli/profile/run/profileRunAction.js';

export interface ProfileRunCommandOption {
  profileName: string;
}

export function useProfileRunCommand(profileCommand: Command) {
  profileCommand
    .command('run')
    .description('Run user profile')
    .argument('<profile>', 'Name of user profile')
    .action(async (profileName: string) => {
      const options: ProfileRunCommandOption = { profileName };
      await profileRunAction(options);
    });
}
