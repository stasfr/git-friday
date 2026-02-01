import process from 'node:process';
import path from 'node:path';

import type { AppConfig } from '@/services/config/config.types.js';

export class ConfigService {
  private getOsPaths() {
    const os = process.platform;

    if (
      os === 'win32' &&
      typeof process.env.LOCALAPPDATA === 'string' &&
      typeof process.env.APPDATA === 'string'
    ) {
      const localAppData = process.env.LOCALAPPDATA;
      const appData = process.env.APPDATA;

      return {
        data: path.join(localAppData, '.git-friday', 'data'),
        config: path.join(appData, '.git-friday', 'config'),
        cache: path.join(localAppData, '.git-friday', 'cache'),
        log: path.join(localAppData, '.git-friday', 'log'),
        temp: path.join(localAppData, 'Temp', '.git-friday'),
      };
    }
  }

  // TODO: add localization to messages in config service
  public getAppConfig() {
    const osPaths = this.getOsPaths();

    if (!osPaths) {
      throw new Error('Unsupported operating system');
    }

    const openRouterApiKey = process.env.OPEN_ROUTER_API_KEY;

    if (!openRouterApiKey) {
      throw new Error(
        'Missing required environment variable: OPEN_ROUTER_API_KEY',
      );
    }

    const aiCompletionModel = process.env.AI_COMPLETION_MODEL;

    if (!aiCompletionModel) {
      throw new Error(
        'Missing required environment variable: AI_COMPLETION_MODEL',
      );
    }

    const appLocalization = process.env.APP_LOCALIZATION ?? 'ru';

    if (
      typeof appLocalization === 'string' &&
      appLocalization !== ('en' as const) &&
      appLocalization !== ('ru' as const)
    ) {
      throw new Error(
        'Invalid value for APP_LOCALIZATION. It must be either "en" or "ru".',
      );
    }

    return {
      paths: osPaths,
      openRouterApiKey,
      aiCompletionModel,
      appLocalization,
    } satisfies AppConfig;
  }
}
