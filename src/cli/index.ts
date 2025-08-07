#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { setupCommands } from './commands.js';
import pkg from '../../package.json' with { type: 'json' };

const program = new Command();

program
  .version(pkg.version)
  .description('A CLI tool to generate reports from git commits using AI');

setupCommands(program);

program.parse(process.argv);
