#!/usr/bin/env node

import 'dotenv/config';

import { checkForUpdates } from '@/services/pkgUpdateService.js';
import { runCli } from '@/cli/runCli.js';

async function main() {
  await checkForUpdates();
  await runCli();
}

void main();
