import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';
import { LlmProviderKeyNames } from '@/cli/commands/config/config.types.js';

import type { ILocalization } from '@/types/localization.js';
import type {
  AppConfig,
  ILlmProviders,
  IOsPaths,
  IFileBasedConfig,
} from '@/cli/commands/config/config.types.js';

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
    if (config === null) {
      throw new Error('Config file is empty');
    }

    if (typeof config !== 'object') {
      throw new Error('Config file is not a valid JSON');
    }

    if (!('llmProvider' in config)) {
      throw new Error('Config file is missing llmProvider property');
    }

    if (typeof config.llmProvider !== 'string') {
      throw new Error('Invalid llmProvider value');
    }

    if (!this.validateLlmProviderName(config.llmProvider)) {
      throw new Error('Invalid provider name. Supported providers: openrouter');
    }

    if (!('aiCompletionModel' in config)) {
      throw new Error('Config file is missing aiCompletionModel property');
    }

    if (typeof config.aiCompletionModel !== 'string') {
      throw new Error('Invalid aiCompletionModel value');
    }

    if (!('appLocalization' in config)) {
      throw new Error('Config file is missing appLocalization property');
    }

    if (typeof config.appLocalization !== 'string') {
      throw new Error('Invalid appLocalization value');
    }

    if (!this.validateAppLocalization(config.appLocalization)) {
      throw new Error(
        'Invalid appLocalization value. Supported values: en, ru',
      );
    }

    return true;
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

  public async checkIfConfigExists() {
    const osPaths = this.getOsPaths();

    if (!osPaths) {
      throw new Error('Unsupported operating system');
    }

    const configFilePath = path.join(osPaths.config, 'config.json');
    await fs.access(configFilePath, constants.F_OK);
  }

  public async initConfig() {
    const osPaths = this.getOsPaths();

    if (!osPaths) {
      throw new Error('Unsupported operating system');
    }

    const emptyConfig = {
      llmProvider: null,
      aiCompletionModel: null,
      appLocalization: null,
    };

    const jsonEmptyConfig = JSON.stringify(emptyConfig, null, 2);
    const configFilePath = path.join(osPaths.config, 'config.json');

    await fs.writeFile(configFilePath, jsonEmptyConfig, 'utf-8');
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
