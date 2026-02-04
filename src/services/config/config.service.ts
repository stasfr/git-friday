import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs/promises';
import { LlmProviderKeyNames } from '@/services/config/config.types.js';

import type { ILocalization } from '@/types/localization.js';
import type {
  AppConfig,
  ILlmProviders,
  IOsPaths,
  IFileBasedConfig,
} from '@/services/config/config.types.js';

export class ConfigService {
  private validateLlmProviderName(
    provider: unknown,
  ): provider is ILlmProviders {
    return typeof provider === 'string' && provider === 'openrouter';
  }

  private validateAppLocalization(
    localization: unknown,
  ): localization is ILocalization {
    return (
      typeof localization === 'string' &&
      (localization === 'en' || localization === 'ru')
    );
  }

  private validateFileBasedConfig(config: unknown): config is IFileBasedConfig {
    return (
      typeof config === 'object' &&
      config !== null &&
      'llmProvider' in config &&
      typeof config.llmProvider === 'string' &&
      this.validateLlmProviderName(config.llmProvider) === true &&
      'aiCompletionModel' in config &&
      typeof config.aiCompletionModel === 'string' &&
      'appLocalization' in config &&
      typeof config.appLocalization === 'string' &&
      this.validateAppLocalization(config.appLocalization) === true
    );
  }

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
      } satisfies IOsPaths;
    }

    return null;
  }

  private async loadConfigFile(osPaths: IOsPaths) {
    const configPath = path.join(osPaths.config, 'config.json');
    const configFile = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configFile);

    if (!this.validateFileBasedConfig(config)) {
      throw new Error('Invalid config file structure');
    }

    return config;
  }

  // TODO: add localization to messages in config service
  public async getAppConfig() {
    const osPaths = this.getOsPaths();

    if (!osPaths) {
      throw new Error('Unsupported operating system');
    }

    const configFile = await this.loadConfigFile(osPaths);

    const apiKeyName = LlmProviderKeyNames.get(configFile.llmProvider);

    if (!apiKeyName) {
      throw new Error(
        'Invalid LLM provider. Could not find API key name in LlmProviderKeyNames',
      );
    }

    const apiKey = process.env[apiKeyName];

    if (!apiKey) {
      throw new Error(`Missing required environment variable: ${apiKeyName}`);
    }

    return {
      llmProvider: configFile.llmProvider,
      apiKeyName,
      aiCompletionModel: configFile.aiCompletionModel,
      appLocalization: configFile.appLocalization,
    } satisfies AppConfig;
  }
}
