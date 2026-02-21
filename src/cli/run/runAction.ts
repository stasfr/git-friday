import ora from 'ora';
import { input, select } from '@inquirer/prompts';

import { ProfileService } from '@/cli/profile/profileService.js';
import { ExtendedError } from '@/errors/ExtendedError.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

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
        command: 'profile run',
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
        command: 'profile run',
        service: null,
        hint: 'Please select a valid profile from the list',
      });
    }
  }

  const profileService = new ProfileService({ profileName });

  const profileConfig = await profileService.getValidProfileConfig();
  const profilePrompts = await profileService.getProfilePrompts();

  const gitService = new GitService();
  const llmService = new LlmService({
    aiCompletionModel: profileConfig.aiCompletionModel,
  });

  let customLog = profileConfig.gitLogCommand;

  if (profileConfig.gitLogCommand === null) {
    console.log('Enter your custom git log command:');
    customLog = await input({
      message: 'git log',
    });
  }

  if (customLog === null) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'No custom git log command provided',
      command: 'profile run',
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
      command: 'profile run',
      service: null,
      hint: 'Check your git log command and try again',
    });
  }
  console.log(`\nCommits count: ${sourceCommits.length}\n`);

  spinner.start('Generating llm response...');

  const llmResponse = await llmService.getCompletion({
    systemPrompt: profilePrompts.systemPrompt,
    userPrompt: profilePrompts.userPrompt + '\n' + sourceCommits.join('\n'),
  });

  if (!llmResponse) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Got empty response from Llm Provider',
      command: 'profile run',
      service: null,
      hint: 'Check LLM provider key and url and try again',
    });
  }

  spinner.succeed('LLM response generated successfully');

  console.log('\nResponse:');
  console.log(llmResponse.content.trim());

  if (llmResponse.usage) {
    const usageTables = generateUsageTables(llmResponse.usage);

    if (usageTables.tokens) {
      console.log('\nTokens Usage Statistics:');
      console.table(usageTables.tokens);
    }

    if (usageTables.cost) {
      console.log('\nCost Statistics in $');
      console.table(usageTables.cost);
    }
  }
}
