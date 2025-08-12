import { OPEN_ROUTER_API_KEY } from '@/config.js';

import { GenerateReportUseCase } from '@/application/use-cases/generate-report.use-case.js';

import { LlmProvider } from '@/infrastructure/providers/llm.provider.js';
import { UuidGenerator } from '@/infrastructure/generators/uuid.generator.js';
import { MockReportRepository } from '@/infrastructure/repositories/mock.repository.js';

if (!OPEN_ROUTER_API_KEY) {
  throw new Error('OPEN_ROUTER_API_KEY is not defined');
}

const idGenerator = new UuidGenerator();
const llmProvider = new LlmProvider(OPEN_ROUTER_API_KEY);
const reportRepository = new MockReportRepository();

export const generateReportUseCase = new GenerateReportUseCase({
  llmProvider,
  idGenerator,
  reportRepository,
});
