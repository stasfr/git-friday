import pkg from '../../../../package.json' with { type: 'json' };
import updateNotifier from 'update-notifier';
import { styleText } from 'node:util';
import boxen from 'boxen';

export async function updateCheckAction() {
  const notifier = updateNotifier({ pkg });
  const update = await notifier.fetchInfo();

  if (update && update.latest !== update.current) {
    const updateMessage =
      'Update available ' +
      styleText('dim', update.current) +
      styleText('reset', ' → ') +
      styleText('green', update.latest) +
      ' \nRun ' +
      styleText('cyan', `'pnpm add -g ${update.name}'`) +
      ' to update';

    const message = boxen(updateMessage, {
      padding: 1,
      margin: 1,
      textAlignment: 'center',
      borderColor: 'yellow',
      borderStyle: 'round',
    });

    console.log(message);
  } else {
    const successMessage =
      'You are using the' +
      styleText('yellow', ' latest ') +
      'version of git-friday.';
    const message = boxen(successMessage, {
      padding: 1,
      margin: 1,
      textAlignment: 'center',
      borderColor: 'green',
      borderStyle: 'round',
    });
    console.log(message);
  }
}
