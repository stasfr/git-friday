import ora from 'ora';
import boxen from 'boxen';

import { $l } from '@/localization/localization.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';
import { changelogPrompts } from '@/cli/changelog/changelogPrompts.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

import type { AppConfig } from '@/cli/config/configTypes.js';
import type { ChangelogCommandOption } from '@/cli/changelog/changelogCommand.js';

export async function changelogAction(
  options: ChangelogCommandOption,
  appConfig: AppConfig,
) {
  const spinner = ora();
  const gitService = new GitService();
  const llmService = new LlmService(appConfig);

  try {
    gitService.sinceTag(options.sinceRef);
    gitService.pretty();

    const sourceCommits = await gitService.getCommitLog();

    if (sourceCommits.length === 0) {
      throw new Error($l('noCommitsFound'));
    }

    console.log(
      boxen(
        `${$l('commandWord')}: ${gitService.command}\n${$l('commitCount')}: ${sourceCommits.length}`,
        {
          title: 'Git Log',
          padding: 0.75,
          margin: 0.75,
          borderColor: 'green',
          borderStyle: 'round',
        },
      ),
    );

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
