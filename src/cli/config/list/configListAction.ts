import { ConfigService } from '@/cli/config/configService.js';

export async function configListAction() {
  const configService = new ConfigService();
  const config = await configService.getRawConfig();

  console.log('Current configuration:');
  console.log(config);
}
