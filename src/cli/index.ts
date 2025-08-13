#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { setupCommands } from './commands.js';
import pkg from '../../package.json' with { type: 'json' };

const program = new Command();

program
  .version(pkg.version)
  .description(pkg.description);

setupCommands(program);

program.parse(process.argv);
