#!/usr/bin/env node

import 'dotenv/config';
import pkg from '../../../package.json' with { type: 'json' };

import { Command } from 'commander';

import { createConfig } from '@/infrastructure/config/config.js';
import { createDiContainer } from '@/infrastructure/di/container.js';
import { report } from '@/infrastructure/cli/commands/report.command.js';

function main(): void {
  const appConfig = createConfig();
  const diContainer = createDiContainer(appConfig);

  const program = new Command();

  program
    .version(pkg.version)
    .description(pkg.description);

  report(program, diContainer);

  program.parse(process.argv);
}

main();
