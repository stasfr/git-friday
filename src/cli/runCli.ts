import pkg from '../../package.json' with { type: 'json' };

import { Command } from 'commander';
import { ExtendedError } from '@/errors/ExtendedError.js';

import { config } from '@/cli/config/configCommand.js';
import { changelog } from '@/cli/changelog/changelogCommand.js';
import { pr } from '@/cli/pr/prCommand.js';
import { report } from '@/cli/report/reportCommand.js';

function buildCli() {
  const program = new Command();

  program.name('friday').version(pkg.version).description(pkg.description);

  config(program);
  changelog(program);
  pr(program);
  report(program);

  return program;
}

export async function runCli() {
  try {
    const program = buildCli();
    await program.parseAsync(process.argv);
  } catch (error: unknown) {
    if (error instanceof ExtendedError) {
      error.logToConsole();
    } else if (error instanceof Error) {
      console.log('Error: ', error.message);
    } else {
      console.log('Unknown error: ', error);
    }
  }
}
