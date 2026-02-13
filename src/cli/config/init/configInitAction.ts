import { ConfigService } from '@/cli/config/configService.js';
import { $l } from '@/localization/localization.js';

export async function configInitAction() {
  try {
    const configService = new ConfigService();
    await configService.initConfig();
  } catch (error) {
    console.log(`${$l('failedToInitializeConfig')}:`, error);
  }
}
