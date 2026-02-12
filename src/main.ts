#!/usr/bin/env node

import 'dotenv/config';

import { setupLocalization } from '@/localization/localization.js';
import { checkForUpdates } from '@/services/pkgUpdateService.js';
import { runCli } from '@/cli/runCli.js';

async function main() {
  await setupLocalization();
  await checkForUpdates();
  await runCli();
}

void main();
