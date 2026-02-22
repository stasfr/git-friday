import { Command } from 'commander';

import { useProfilePromptAddCommand } from '@/cli/profile/prompt/add/profilePromptAddCommand.js';

export function useProfilePromptCommand(profileCommand: Command) {
  const profilePromptCommand = profileCommand
    .command('prompt')
    .description('Manage profile prompts for LLM');

  useProfilePromptAddCommand(profilePromptCommand);
}
