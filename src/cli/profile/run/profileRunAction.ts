import ora from 'ora';

import { ConfigService } from '@/cli/config/configService.js';
import { ProfileService } from '@/cli/profile/profileService.js';
import { ExtendedError } from '@/errors/ExtendedError.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

import type { ProfileRunCommandOption } from '@/cli/profile/run/profileRunCommand.js';

export async function profileRunAction(options: ProfileRunCommandOption) {
  const spinner = ora();
  const configService = new ConfigService();
  const profileService = new ProfileService(configService, options.profileName);

  const appConfig = await configService.getValidAppConfig();
  const profileConfig = await profileService.getValidProfileConfig();
  const profilePrompts = await profileService.getProfilePrompts();

  const gitService = new GitService();
  const llmService = new LlmService(appConfig);

  const sourceCommits = await gitService
    .customLog(profileConfig.gitLogCommand)
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
