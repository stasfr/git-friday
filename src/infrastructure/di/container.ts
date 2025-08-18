/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContainer, InjectionMode, asValue, asClass, type AwilixContainer } from 'awilix';

import ora, { type Ora } from 'ora';

import { GenerateReportUseCase } from '@/application/use-cases/generate-report.use-case.js';

import { LlmProvider } from '@/infrastructure/providers/llm.provider.js';
import { UuidGenerator } from '@/infrastructure/generators/uuid.generator.js';

import { JsonDbClient } from '@/infrastructure/db/lowdb.client.js';
import { JsonReportRepository } from '@/infrastructure/repositories/report.repository.js';

import { GitService } from '@/cli/services/git.service.js';

export interface Container {
  spinner: Ora;

  openRouterApiKey: string;
  aiCompletionModel: string;
  jsonDbPath: string;

  idGenerator: UuidGenerator;
  llmProvider: LlmProvider;

  dbClient: JsonDbClient;
  reportRepository: JsonReportRepository;

  gitService: GitService;

  generateReportUseCase: GenerateReportUseCase;
}

export type DiContainer = AwilixContainer<Container>;

const diContainer = createContainer<Container>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

diContainer.register({
  spinner: asValue(ora()),

  openRouterApiKey: asValue(process.env.OPEN_ROUTER_API_KEY!),
  aiCompletionModel: asValue(process.env.AI_COMPLETION_MODEL!),
  jsonDbPath: asValue(process.env.JSONDB_PATH!),

  idGenerator: asClass(UuidGenerator),
  llmProvider: asClass(LlmProvider),

  dbClient: asClass(JsonDbClient),
  reportRepository: asClass(JsonReportRepository),

  gitService: asClass(GitService),

  generateReportUseCase: asClass(GenerateReportUseCase),
});

export { diContainer };
