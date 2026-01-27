import {
  createContainer,
  InjectionMode,
  asValue,
  asClass,
  type AwilixContainer,
} from 'awilix';

import type { AppConfig } from '@/infrastructure/config/config.js';

import ora, { type Ora } from 'ora';

import { GenerateReportUseCase } from '@/application/use-cases/generate-report.use-case.js';
import { GeneratePullRequestUseCase } from '@/application/use-cases/generate-pull-request.use-case.js';
import { GenerateChangeLogUseCase } from '@/application/use-cases/generate-changelog.use-case.js';

import { LlmProvider } from '@/infrastructure/providers/llm.provider.js';
import { UuidGenerator } from '@/infrastructure/generators/uuid.generator.js';

import { JsonDbClient } from '@/infrastructure/db/lowdb.client.js';
import { JsonReportRepository } from '@/infrastructure/repositories/report.repository.js';

import { GitService } from '@/infrastructure/cli/services/git.service.js';

interface Container {
  spinner: Ora;

  openRouterApiKey: AppConfig['aiCompletionModel'];
  aiCompletionModel: AppConfig['aiCompletionModel'];
  jsonDbPath: AppConfig['jsonDbPath'];

  idGenerator: UuidGenerator;
  llmProvider: LlmProvider;

  dbClient: JsonDbClient;
  reportRepository: JsonReportRepository;

  gitService: GitService;

  generateReportUseCase: GenerateReportUseCase;
  generatePullRequestUseCase: GeneratePullRequestUseCase;
  generateChangeLogUseCase: GenerateChangeLogUseCase;
}

export type DiContainer = AwilixContainer<Container>;

export function createDiContainer(config: AppConfig) {
  const diContainer = createContainer<Container>({
    injectionMode: InjectionMode.PROXY,
    strict: true,
  });

  diContainer.register({
    spinner: asValue(ora()),

    openRouterApiKey: asValue(config.openRouterApiKey),
    aiCompletionModel: asValue(config.aiCompletionModel),
    jsonDbPath: asValue(config.jsonDbPath),

    idGenerator: asClass(UuidGenerator),
    llmProvider: asClass(LlmProvider).singleton(),

    dbClient: asClass(JsonDbClient).singleton(),
    reportRepository: asClass(JsonReportRepository).singleton(),

    gitService: asClass(GitService),

    generateReportUseCase: asClass(GenerateReportUseCase),
    generatePullRequestUseCase: asClass(GeneratePullRequestUseCase),
    generateChangeLogUseCase: asClass(GenerateChangeLogUseCase),
  });

  return diContainer;
}
