#!/usr/bin/env node
import 'dotenv/config';

import { OPEN_ROUTER_API_KEY, AI_COMPLETION_MODEL } from './config.js';

import { AiWorker } from './ai.js';
import { CommitsWorker } from './commits.js';
import { StatisticsCollector } from './statistics.js';

async function main(): Promise<void> {
  if (!OPEN_ROUTER_API_KEY || !AI_COMPLETION_MODEL) {
    console.error('OPEN_ROUTER_API_KEY or AI_COMPLETION_MODEL is not set');
    process.exit(1);
  }

  const statisticsCollector = StatisticsCollector.create();

  const aiWorker = AiWorker.create({
    apiKey: OPEN_ROUTER_API_KEY,
    modelName: AI_COMPLETION_MODEL,
    statisticsCollector,
  });

  const commitsWorker = CommitsWorker.create({
    authors: ['stas_fr', 's.farkash'],
    branch: 'dev',
  });

  const commits = await commitsWorker.getCommits();

  if (!commits) {
    console.log('no commits');
    console.log('---\n');
    console.log('usage:', statisticsCollector.statistics);

    return;
  }

  const report = await aiWorker.generateReport(commits);

  if (!report) {
    console.log('no report');
    console.log('---\n');
    console.log('usage:', statisticsCollector.statistics);

    return;
  }

  console.log(report);
  console.log('---\n');
  console.log('usage:', statisticsCollector.statistics);
}

void main();
