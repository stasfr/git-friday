import { ConfigService } from '@/cli/commands/config/config.service.js';

export async function configInitAction() {
  try {
    const configService = new ConfigService();
    await configService.initConfig();
  } catch (error) {
    console.error('Failed to initialize configuration:', error);
  }
}
