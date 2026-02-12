import pkg from '../../package.json' with { type: 'json' };
import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import boxen from 'boxen';

import { $l } from '@/localization/localization.js';

export async function checkForUpdates() {
  try {
    const notifier = updateNotifier({ pkg });
    const update = await notifier.fetchInfo();

    if (update && update.latest !== update.current) {
      const updateMessage =
        `${$l('updateAvailable')} ` +
        chalk.dim(update.current) +
        chalk.reset(' → ') +
        chalk.green(update.latest) +
        ` \n${$l('runWord')} ` +
        chalk.cyan(`'pnpm add -g ${update.name}'`) +
        ` ${$l('toUpdateWord')}`;

      const message = boxen(updateMessage, {
        padding: 1,
        margin: 1,
        textAlignment: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      });

      console.log(message);
    }
  } catch (error: unknown) {
    console.log($l('failedToCheckForUpdates'));
    console.log($l('errorWord') + ':');
    console.log(error instanceof Error ? error.message : error);
  }
}
