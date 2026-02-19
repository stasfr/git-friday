import ora from 'ora';
import boxen from 'boxen';
import { input } from '@inquirer/prompts';

import { $l } from '@/localization/localization.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';
import { reportPrompts } from '@/cli/report/reportPrompts.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

import type { AppConfig } from '@/cli/config/configTypes.js';
import type { ReportCommandOption } from '@/cli/report/reportCommand.js';

export async function reportAction(
  options: ReportCommandOption,
  appConfig: AppConfig,
) {
  const spinner = ora();
  const gitService = new GitService();
  const llmService = new LlmService(appConfig);

  try {
    if (options.customLog == false) {
      if (options.all === true) {
        gitService.forAllBranches();
      }

      if (options.branches && options.branches.length > 0) {
        gitService.forBranches(options.branches);
      }

      if (options.authors) {
        gitService.forAuthors(options.authors);
      } else if (options.currentUser) {
        await gitService.forCurrentUser();
      }

      if (options.since) {
        gitService.since(options.since);
      }

      if (options.until) {
        gitService.until(options.until);
      }

      if (options.today === true) {
        gitService.today();
      }
    } else {
      const customLog = await input({
        message: 'Enter your custom git log command: git log',
      });

      gitService.customLog(customLog);
    }

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

    spinner.start($l('generatingReport'));

    const systemPrompt = reportPrompts.getSystemPrompts(
      appConfig.appLocalization,
    );
    const userPrompt = reportPrompts.getUserPrompt(
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

    spinner.succeed($l('reportGeneratedSuccessfully'));

    console.log();
    console.log($l('reportWord'));
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
        console.log($l('costStatistics'));
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
