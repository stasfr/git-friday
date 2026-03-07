import ora from 'ora';
import { text, confirm, isCancel } from '@clack/prompts';

import { profileNameSelect } from '@/ui/profileNameSelect.js';
import { ProfileService } from '@/cli/profile/profileService.js';
import { CommandExecutionError } from '@/errors/Errors.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';
import { FsService } from '@/services/fsService.js';

import type { RunCommandOption } from '@/cli/run/runCommand.js';

export async function runAction(options: RunCommandOption) {
  if (options.cliOutput === false && options.fileOutput === false) {
    throw new CommandExecutionError({
      message: 'No output option selected',
      hint: 'Please select at least one output option. Add the -c for console output or -f to save the output to a file.',
    });
  }

  const profileName = await profileNameSelect({
    profile: options.profile,
  });

  const profileService = new ProfileService({ profileName });
  const gitService = new GitService();
  const fsService = new FsService();

  const profileConfig = await profileService.getValidProfileConfig();
  const profilePrompts = await profileService.getProfilePrompts();

  const outputFileName = 'llm_response.md';
  if (options.fileOutput === true) {
    const fileExists = await fsService.hasFile(outputFileName);

    if (fileExists) {
      const shouldOverwrite = await confirm({
        message: `File ${outputFileName} already exists. Overwrite?`,
        initialValue: false,
      });

      if (isCancel(shouldOverwrite) || shouldOverwrite === false) {
        console.log('Operation cancelled');
        process.exit(0);
      }
    }
  }

  let customLog = profileConfig.gitLogCommand;

  if (options.gitLog || customLog === null) {
    console.log('Enter your custom git log command:');
    const customLogInput = await text({
      message: 'git log',
    });

    if (isCancel(customLogInput)) {
      console.log('Operation cancelled');
      process.exit(0);
    }

    customLog = customLogInput;
  }

  if (customLog === null) {
    throw new CommandExecutionError({
      message: 'No custom git log command provided',
      hint: 'Please enter a valid git log command or configure it in your profile',
    });
  }

  const sourceCommits = await gitService.buildCommand(customLog).getCommitLog();

  if (sourceCommits.length === 0) {
    throw new CommandExecutionError({
      message: 'No commits found for the specified filters',
      hint: 'Check your git log command and try again',
    });
  }

  let diffOutput: string | undefined;

  if (options.gitDiff) {
    console.log('Enter your custom git diff command:');
    const diffCommandInput = await text({
      message: 'git diff',
    });

    if (isCancel(diffCommandInput)) {
      console.log('Operation cancelled');
      process.exit(0);
    }

    if (!diffCommandInput || diffCommandInput.trim() === '') {
      throw new CommandExecutionError({
        message: 'No git diff command provided',
        hint: 'Please enter a valid git diff command',
      });
    }

    diffOutput = await gitService.buildDiffCommand(diffCommandInput).getDiff();
  }

  const shouldProceed = await confirm({
    message: `Found ${sourceCommits.length} commits matching the specified filters. Send request to LLM?`,
  });

  if (isCancel(shouldProceed) || !shouldProceed) {
    console.log('Command cancelled');
    process.exit(0);
  }

  const llmService = new LlmService({
    aiCompletionModel: profileConfig.aiCompletionModel,
    prompts: {
      systemPrompt: profilePrompts.systemPrompt,
      userPrompt: profilePrompts.userPrompt,
    },
    context: {
      commits: sourceCommits.join('\n'),
      diff: diffOutput,
    },
  });

  console.log();
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
    throw new CommandExecutionError({
      message: 'Got empty response from Llm Provider',
      hint: 'Check LLM provider key and url and try again',
    });
  }

  if (options.fileOutput === true) {
    const filePath = await fsService.writeFile(
      process.cwd(),
      outputFileName,
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
