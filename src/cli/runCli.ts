import pkg from '../../package.json' with { type: 'json' };

import { Command } from 'commander';
import { ExtendedError } from '@/errors/ExtendedError.js';

import { useProfileCommand } from '@/cli/profile/profileCommand.js';

function buildCli() {
  const program = new Command();

  program.name('friday').version(pkg.version).description(pkg.description);

  useProfileCommand(program);

  return program;
}

export async function runCli() {
  try {
    const program = buildCli();
    await program.parseAsync(process.argv);
  } catch (error) {
    if (error instanceof ExtendedError) {
      error.logToConsole();
    } else if (error instanceof Error) {
      console.log('Unknown error:', error.message);
    } else {
      console.log('Unrecognized error:', error);
    }
  }
}
