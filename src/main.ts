#!/usr/bin/env node

import 'dotenv/config';
import pkg from '../package.json' with { type: 'json' };
import updateNotifier from 'update-notifier';

import { Command } from 'commander';

import { report } from '@/cli/commands/report/report.command.js';

async function main() {
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

  const program = new Command();

  program.version(pkg.version).description(pkg.description);

  report(program);

  program.parse(process.argv);
}

void main();
