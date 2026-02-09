#!/usr/bin/env node

import 'dotenv/config';
import pkg from '../package.json' with { type: 'json' };
import updateNotifier from 'update-notifier';

import { Command } from 'commander';

import { config } from '@/cli/commands/config/config.command.js';

import { changelog } from '@/cli/commands/changelog/changelog.command.js';
import { pr } from '@/cli/commands/pr/pr.command.js';
import { report } from '@/cli/commands/report/report.command.js';

async function main() {
  try {
    const notifier = updateNotifier({ pkg });
    const update = await notifier.fetchInfo();

    if (update && update.latest !== update.current) {
      console.log(`Update available ${update.current} -> ${update.latest}`);
      console.log(`Run 'pnpm add -g ${update.name}' to install it\n`);
    }
  } catch (error: unknown) {
    console.log(
      'Could not check for updates. Error:',
      error instanceof Error ? error.message : error,
    );
  }

  const program = new Command();

  program.name('friday').version(pkg.version).description(pkg.description);

  config(program);

  changelog(program);
  pr(program);
  report(program);

  program.parseAsync(process.argv);
}

void main();
