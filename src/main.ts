#!/usr/bin/env node

import 'dotenv/config';
import pkg from '../package.json' with { type: 'json' };

import { setupLocalization } from '@/localization/localization.js';
import { checkForUpdates } from '@/services/pkgUpdateService.js';
import { Command } from 'commander';

import { config } from '@/cli/config/configCommand.js';

import { changelog } from '@/cli/changelog/changelogCommand.js';
import { pr } from '@/cli/pr/prCommand.js';
import { report } from '@/cli/report/reportCommand.js';

async function main() {
  await setupLocalization();

  await checkForUpdates();

  try {
    const program = new Command();

    program.name('friday').version(pkg.version).description(pkg.description);

    config(program);

    changelog(program);
    pr(program);
    report(program);

    await program.parseAsync(process.argv);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error: ', error.message);
    } else {
      console.log('Unknown error: ', error);
    }
  }
}

void main();
