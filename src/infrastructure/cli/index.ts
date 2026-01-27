#!/usr/bin/env node

import 'dotenv/config';
import pkg from '../../../package.json' with { type: 'json' };
import updateNotifier from 'update-notifier';

import { Command } from 'commander';

import { createConfig } from '@/infrastructure/config/config.js';
import { createDiContainer } from '@/infrastructure/di/container.js';

import { report } from '@/infrastructure/cli/commands/report.command.js';
import { pr } from '@/infrastructure/cli/commands/pr.command.js';
import { changelog } from '@/infrastructure/cli/commands/changelog.command.js';

async function main(): Promise<void> {
  try {
    const notifier = updateNotifier({ pkg });
    const update = await notifier.fetchInfo();

    if (update && update.latest !== update.current) {
      console.log(`Update available ${update.current} -> ${update.latest}`);
      console.log(`Run 'npm i -g ${update.name}' to install it\n`);
    }
  } catch (error: unknown) {
    console.log(
      'Could not check for updates. Error:',
      error instanceof Error ? error.message : error,
    );
  }

  const appConfig = createConfig();
  const diContainer = createDiContainer(appConfig);

  const program = new Command();

  program.version(pkg.version).description(pkg.description);

  report(program, diContainer);
  pr(program, diContainer);
  changelog(program, diContainer);

  program.parse(process.argv);
}

void main();
