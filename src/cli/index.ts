#!/usr/bin/env node

import 'dotenv/config';
import pkg from '../../package.json' with { type: 'json' };

import { Command } from 'commander';

import { report } from '@/cli/commands/report.command.js';

const program = new Command();

program
  .version(pkg.version)
  .description(pkg.description);

report(program);

program.parse(process.argv);
