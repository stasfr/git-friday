import pkg from '../../package.json' with { type: 'json' };

import { Command } from 'commander';
import { printError } from '@/errors/index.js';

import { useUpdateCommand } from '@/cli/update/updateCommand.js';
import { useRunCommand } from '@/cli/run/runCommand.js';
import { useProfileCommand } from '@/cli/profile/profileCommand.js';

function buildCli() {
  const program = new Command();

  program.name('friday').version(pkg.version).description(pkg.description);

  useUpdateCommand(program);
  useRunCommand(program);
  useProfileCommand(program);

  return program;
}

export async function runCli() {
  try {
    const program = buildCli();
    await program.parseAsync(process.argv);
  } catch (error) {
    printError(error);
  }
}
