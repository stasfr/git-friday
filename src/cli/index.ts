#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { setupCommands } from './commands.js';

const program = new Command();

program
  .version('0.2.0')
  .description('A CLI tool to generate reports from git commits using AI');

setupCommands(program);

program.parse(process.argv);
