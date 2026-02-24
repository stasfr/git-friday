import ora from 'ora';
import { input, confirm } from '@inquirer/prompts';

import { profileNameSelect } from '@/ui/profileNameSelect.js';
import { sanitizeFilename } from '@/utils/stringUtils.js';
import { ProfileService } from '@/cli/profile/profileService.js';
import { ExtendedError } from '@/errors/ExtendedError.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';
import { FsService } from '@/services/fsService.js';

import type { RunCommandOption } from '@/cli/run/runCommand.js';

export async function runAction(options: RunCommandOption) {
  if (options.cliOutput === false && options.fileOutput === false) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'No output option selected',
      command: 'run',
      service: null,
      hint: 'Please select at least one output option. Add the -c for console output or -f to save the output to a file.',
    });
  }

  if (
    typeof options.fileOutput === 'string' &&
    options.fileOutput.trim().length === 0
  ) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Invalid file output path',
      command: 'run',
      service: null,
      hint: 'Please provide a valid file path for the output.',
    });
  }

  const profileName = await profileNameSelect({
    profile: options.profile,
    command: 'run',
  });

  const profileService = new ProfileService({ profileName });
  const gitService = new GitService();
  const fsService = new FsService();

  const profileConfig = await profileService.getValidProfileConfig();
  const profilePrompts = await profileService.getProfilePrompts();

  let fileName = 'llm_response.md';
  if (options.fileOutput === true || typeof options.fileOutput === 'string') {
    if (typeof options.fileOutput === 'string') {
      fileName = `${sanitizeFilename(options.fileOutput.trim())}.md`;
    }

    const fileExists = await fsService.hasFile(fileName);

    if (fileExists) {
      const shouldOverwrite = await confirm({
        message: `File ${fileName} already exists. Overwrite?`,
        default: false,
      });

      if (!shouldOverwrite) {
        console.log('Command cancelled');
        return;
      }
    }
  }

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
      message: 'No commits found for the specified filters',
      command: 'run',
      service: null,
      hint: 'Check your git log command and try again',
    });
  }
  console.log(`\nCommits count: ${sourceCommits.length}\n`);

  const shouldProceed = await confirm({
    message: `Found ${sourceCommits.length} commits matching the specified filters. Send request to LLM?`,
  });

  if (!shouldProceed) {
    console.log('Command cancelled');
    return;
  }

  const llmService = new LlmService({
    aiCompletionModel: profileConfig.aiCompletionModel,
    prompts: {
      systemPrompt: profilePrompts.systemPrompt,
      userPrompt: profilePrompts.userPrompt + '\n' + sourceCommits.join('\n'),
    },
  });

  const spinner = ora();
  try {
    spinner.start('Generating llm response...');
    await llmService.getCompletion();
    spinner.succeed('LLM response generated successfully');
  } catch (error) {
    spinner.fail('Failed to generate LLM response');
    throw error;
  }

  if (!llmService.content) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Got empty response from Llm Provider',
      command: 'run',
      service: null,
      hint: 'Check LLM provider key and url and try again',
    });
  }

  if (options.fileOutput === true || typeof options.fileOutput === 'string') {
    const filePath = await fsService.writeFile(
      process.cwd(),
      fileName,
      llmService.content,
    );
    console.log(`LLM response saved to ${filePath}`);
  }

  if (options.cliOutput === true) {
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
