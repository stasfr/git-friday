import ora from 'ora';
import { input, select } from '@inquirer/prompts';

import { ProfileService } from '@/cli/profile/profileService.js';
import { ExtendedError } from '@/errors/ExtendedError.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';

import type { RunCommandOption } from '@/cli/run/runCommand.js';

export async function runAction(options: RunCommandOption) {
  let profileName = options.profileName;

  const spinner = ora();

  if (!profileName) {
    const profiles = await ProfileService.listAllProfiles();

    if (profiles.length === 0) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'No profiles found',
        command: 'run',
        service: null,
        hint: 'Create a profile first using "profile create" command',
      });
    }

    profileName = await select({
      message: 'Select a profile:',
      choices: profiles.map((name) => ({
        name,
        value: name,
      })),
    });

    if (typeof profileName !== 'string' || profileName.length === 0) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'Invalid profile selection',
        command: 'run',
        service: null,
        hint: 'Please select a valid profile from the list',
      });
    }
  } else {
    const profileExists =
      await ProfileService.checkIfProfileExists(profileName);
    if (!profileExists) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'Profile does not exist',
        command: 'run',
        service: null,
        hint: 'Please create a profile first using "profile create" command',
      });
    }
  }

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

  spinner.start('Generating llm response...');

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

  console.log('\nResponse:');
  console.log(llmService.content.trim());

  if (llmService.usage) {
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
