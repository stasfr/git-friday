import ora from 'ora';
import { input } from '@inquirer/prompts';

import { profileNameSelect } from '@/ui/profileNameSelect.js';

import { ProfileService } from '@/cli/profile/profileService.js';
import { ExtendedError } from '@/errors/ExtendedError.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';

import type { RunCommandOption } from '@/cli/run/runCommand.js';

export async function runAction(options: RunCommandOption) {
  const profileName = await profileNameSelect({
    profile: options.profile,
    command: 'run',
  });

  const profileService = new ProfileService({ profileName });

  const profileConfig = await profileService.getValidProfileConfig();
  const profilePrompts = await profileService.getProfilePrompts();

  const gitService = new GitService();

  let customLog = profileConfig.gitLogCommand;

  if (options.gitLog || customLog === null) {
    console.log('Enter your custom git log command:');
    customLog = await input({
      message: 'git log',
    });
  }

  if (customLog === null) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'No custom git log command provided',
      command: 'run',
      service: null,
      hint: 'Please enter a valid git log command or configure it in your profile',
    });
  }

  const sourceCommits = await gitService
    .customLog(customLog)
    .pretty()
    .getCommitLog();

  if (sourceCommits.length === 0) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'No commits found for the specified criteria',
      command: 'run',
      service: null,
      hint: 'Check your git log command and try again',
    });
  }
  console.log(`\nCommits count: ${sourceCommits.length}\n`);

  const spinner = ora().start('Generating llm response...');

  const llmService = new LlmService({
    aiCompletionModel: profileConfig.aiCompletionModel,
    prompts: {
      systemPrompt: profilePrompts.systemPrompt,
      userPrompt: profilePrompts.userPrompt + '\n' + sourceCommits.join('\n'),
    },
  });

  await llmService.getCompletion();

  if (!llmService.content) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Got empty response from Llm Provider',
      command: 'run',
      service: null,
      hint: 'Check LLM provider key and url and try again',
    });
  }

  spinner.succeed('LLM response generated successfully');

  if (options.disableOutput === false) {
    console.log('\nResponse:');
    console.log(llmService.content.trim());
  }

  if (llmService.usage && options.statistics === true) {
    if (llmService.usage.tokens) {
      console.log('\nTokens Usage Statistics:');
      console.table(llmService.usage.tokens);
    }

    if (llmService.usage.cost) {
      console.log('\nCost Statistics in $');
      console.table(llmService.usage.cost);
    }
  }
}
