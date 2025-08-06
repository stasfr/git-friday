import { GenerateReportUseCase } from '@/application/use-cases/generate-report.use-case.js';
import { LlmProvider } from '@/infrastructure/providers/llm.provider.js';
import { UuidGenerator } from '@/infrastructure/generators/uuid.generator.js';
import { OPEN_ROUTER_API_KEY } from '@/config.js';

if (!OPEN_ROUTER_API_KEY) {
  throw new Error('OPEN_ROUTER_API_KEY is not defined');
}

const idGenerator = new UuidGenerator();
const llmProvider = new LlmProvider(OPEN_ROUTER_API_KEY);

export const generateReportUseCase = new GenerateReportUseCase({
  llmProvider,
  idGenerator,
});
