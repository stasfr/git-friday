import pkg from '../../package.json' with { type: 'json' };
import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import boxen from 'boxen';

export async function checkForUpdates() {
  try {
    const notifier = updateNotifier({ pkg });
    const update = await notifier.fetchInfo();

    if (update && update.latest !== update.current) {
      const updateMessage =
        'Update available ' +
        chalk.dim(update.current) +
        chalk.reset(' → ') +
        chalk.green(update.latest) +
        ' \nRun ' +
        chalk.cyan(`'pnpm add -g ${update.name}'`) +
        ' to update';

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
    console.log('Failed to check for updates');
    console.log('Error:');
    console.log(error instanceof Error ? error.message : error);
  }
}
