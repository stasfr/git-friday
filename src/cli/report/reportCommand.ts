import { Command } from 'commander';
import { ConfigService } from '@/cli/config/configService.js';
import { configExistCheckHook } from '@/cli/config/hooks/configExistCheckHook.js';
import { reportAction } from '@/cli/report/reportAction.js';

export function report(program: Command) {
  program
    .command('report')
    .description('Generate a report from git commits')
    .hook('preAction', configExistCheckHook)
    .action(async () => {
      const configService = new ConfigService();
      const appConfig = await configService.getAppConfig();
      await reportAction(appConfig);
    });
}
