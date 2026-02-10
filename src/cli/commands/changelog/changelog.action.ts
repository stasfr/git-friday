import ora from 'ora';

import { setupLocalization, $l } from '@/localization/localization.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/git.service.js';
import { changelogPrompts } from '@/cli/commands/changelog/changelog.prompts.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

import type { AppConfig } from '@/cli/commands/config/config.types.js';
import type { ChangelogCommandOption } from '@/cli/commands/changelog/changelog.command.js';

export async function changelogAction(
  options: ChangelogCommandOption,
  appConfig: AppConfig,
) {
  const spinner = ora();
  setupLocalization(appConfig.appLocalization);
  const gitService = new GitService();
  const llmService = new LlmService(appConfig);

  try {
    spinner.start($l('creatingGitLogCommand'));

    gitService.sinceTag(options.sinceRef);

    gitService.pretty();
    spinner.succeed(`${$l('gitLogCommandCreated')}: ${gitService.command}`);

    spinner.start($l('searchingForCommits'));
    const sourceCommits = await gitService.getCommitLog();

    if (sourceCommits.length === 0) {
      throw new Error($l('noCommitsFound'));
    }

    spinner.succeed(`${$l('commitsFounded')}: ${sourceCommits.length}`);
    spinner.start($l('generatingChangelog'));

    const systemPrompt = changelogPrompts.getSystemPrompts(
      appConfig.appLocalization,
    );
    const userPrompt = changelogPrompts.getUserPrompt(
      sourceCommits.join('\n'),
      appConfig.appLocalization,
    );

    const llmResponse = await llmService.getCompletion({
      systemPrompt,
      userPrompt,
    });

    if (!llmResponse) {
      throw new Error($l('gotEmptyResponseFromLlm'));
    }

    spinner.succeed($l('changelogGeneratedSuccessfully'));

    console.log();
    console.log($l('changelogWord'));
    console.log(llmResponse.content.trim());

    if (llmResponse.usage) {
      const usageTables = generateUsageTables(llmResponse.usage);

      if (usageTables.tokens) {
        console.log();
        console.log($l('tokenUsageStatisticsTitle'));
        console.table(usageTables.tokens);
      }

      if (usageTables.cost) {
        console.log();
        console.log('Cost Statistics in $:');
        console.table(usageTables.cost);
      }
    }
  } catch (error: unknown) {
    spinner.fail(
      `${$l('errorOccured')}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
