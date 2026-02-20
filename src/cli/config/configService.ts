import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';

import { ExtendedError } from '@/errors/ExtendedError.js';

import type {
  ILocalizationTypes,
  AppConfig,
  IOsPaths,
  IFileBasedConfig,
} from '@/cli/config/configTypes.js';

export class ConfigService {
  private validateLlmPromptsLocalization(
    localization: unknown,
  ): localization is ILocalizationTypes {
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

    if (!('aiCompletionModel' in config)) {
      throw new Error('Config file is missing aiCompletionModel property');
    }

    if (typeof config.aiCompletionModel !== 'string') {
      throw new Error('Invalid aiCompletionModel value');
    }

    if (
      'llmPromptsLocalization' in config &&
      typeof config.llmPromptsLocalization === 'string' &&
      !this.validateLlmPromptsLocalization(config.llmPromptsLocalization)
    ) {
      throw new Error(
        'Invalid llmPromptsLocalization value. Supported values: en, ru',
      );
    }

    return true;
  }

  private getOsPaths() {
    const os = process.platform;

    if (os !== 'win32') {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Unsupported OS',
        command: null,
        service: null,
        hint: 'At this point, only Windows is supported',
      });
    }

    if (!process.env.LOCALAPPDATA || !process.env.APPDATA) {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Missing environment variables for Windows',
        command: null,
        service: null,
        hint: 'process.env.LOCALAPPDATA or process.env.APPDATA',
      });
    }

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
    const configFilePath = path.join(osPaths.config, 'config.json');
    try {
      await fs.access(configFilePath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  public async initConfig() {
    const osPaths = this.getOsPaths();
    const emptyConfig = {
      aiCompletionModel: null,
      llmPromptsLocalization: null,
    };

    const jsonEmptyConfig = JSON.stringify(emptyConfig, null, 2);
    const configFilePath = path.join(osPaths.config, 'config.json');

    await fs.writeFile(configFilePath, jsonEmptyConfig, 'utf-8');
  }

  public async setValueToKey(key: string, value: string) {
    const osPaths = this.getOsPaths();
    const configPath = path.join(osPaths.config, 'config.json');
    const configFile = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configFile);

    config[key] = value;

    const updatedConfig = JSON.stringify(config, null, 2);
    await fs.writeFile(configPath, updatedConfig, 'utf-8');
  }

  public async getAppConfig() {
    const osPaths = this.getOsPaths();
    const configFile = await this.loadConfigFile(osPaths);

    return {
      aiCompletionModel: configFile.aiCompletionModel,
      llmPromptsLocalization: configFile.llmPromptsLocalization ?? null,
    } satisfies AppConfig;
  }
}
