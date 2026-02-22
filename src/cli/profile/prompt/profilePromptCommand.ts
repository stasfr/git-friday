import { Command } from 'commander';

import { useProfilePromptAddCommand } from '@/cli/profile/prompt/add/profilePromptAddCommand.js';
import { useProfilePromptReadCommand } from '@/cli/profile/prompt/read/profilePromptReadCommand.js';

export function useProfilePromptCommand(profileCommand: Command) {
  const profilePromptCommand = profileCommand
    .command('prompt')
    .description('Manage profile prompts for LLM');

  useProfilePromptAddCommand(profilePromptCommand);
  useProfilePromptReadCommand(profilePromptCommand);
}
