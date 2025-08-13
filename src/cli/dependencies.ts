import { OPEN_ROUTER_API_KEY, JSONDB_PATH } from '@/config.js';

import { GenerateReportUseCase } from '@/application/use-cases/generate-report.use-case.js';
import { SaveReportUseCase } from '@/application/use-cases/save-report.use-case.js';

import { LlmProvider } from '@/infrastructure/providers/llm.provider.js';
import { UuidGenerator } from '@/infrastructure/generators/uuid.generator.js';

import { initializeJsonDbClient } from '@/infrastructure/db/lowdb.client.js';
import { JsonReportRepository } from '@/infrastructure/repositories/report.repository.js';

import { GitService } from '@/cli/services/git.service.js';

if (!OPEN_ROUTER_API_KEY) {
  throw new Error('OPEN_ROUTER_API_KEY is not defined');
}

if (!JSONDB_PATH) {
  throw new Error('JSONDB_PATH is not defined');
}

const idGenerator = new UuidGenerator();
const llmProvider = new LlmProvider(OPEN_ROUTER_API_KEY);

const dbClient = initializeJsonDbClient(JSONDB_PATH);
const reportRepository = new JsonReportRepository(dbClient);

export const gitService = new GitService();

export const generateReportUseCase = new GenerateReportUseCase({
  llmProvider,
  idGenerator,
});

export const saveReportUseCase = new SaveReportUseCase({ reportRepository });
