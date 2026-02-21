import { Command } from 'commander';
import { ConfigService } from '@/cli/config/configService.js';
import { reportAction } from '@/cli/report/reportAction.js';

export function report(program: Command) {
  program
    .command('report')
    .description('Generate a report from git commits')
    .action(async () => {
      const configService = new ConfigService();
      const appConfig = await configService.getValidAppConfig();
      await reportAction(appConfig);
    });
}
