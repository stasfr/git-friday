#!/usr/bin/env node

import { runCli } from '@/cli/runCli.js';

async function main() {
  await runCli();
}

void main();
