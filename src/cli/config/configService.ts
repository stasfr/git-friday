import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';

import { ExtendedError } from '@/errors/ExtendedError.js';

import type {
  AppConfig,
  IOsPaths,
  IFileBasedConfig,
} from '@/cli/config/configTypes.js';

export class ConfigService {
  private validateFileBasedConfig(config: unknown): config is IFileBasedConfig {
    if (config === null) {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Config file is empty',
        command: null,
        service: null,
        hint: 'Ensure config file contains valid JSON content. Run "friday config setup"',
      });
    }

    if (typeof config !== 'object') {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Config file is not a valid JSON',
        command: null,
        service: null,
        hint: 'Ensure config file is valid JSON format. Run "friday config setup"',
      });
    }

    if (!('aiCompletionModel' in config)) {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Config file is missing aiCompletionModel property',
        command: null,
        service: null,
        hint: 'Add aiCompletionModel property to config file. Run "friday config set" or "friday config setup"',
      });
    }

    if (typeof config.aiCompletionModel !== 'string') {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Invalid aiCompletionModel value',
        command: null,
        service: null,
        hint: 'aiCompletionModel must be a string. Run "friday config set" or "friday config setup"',
      });
    }

    if (!('llmPromptsLocalization' in config)) {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Config file is missing llmPromptsLocalization property',
        command: null,
        service: null,
        hint: 'Add llmPromptsLocalization property to config file. Run "friday config set" or "friday config setup"',
      });
    }

    if (
      config.llmPromptsLocalization !== 'en' &&
      config.llmPromptsLocalization !== 'ru'
    ) {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Invalid llmPromptsLocalization value',
        command: null,
        service: null,
        hint: 'Supported values: en, ru. Run "friday config set" or "friday config setup"',
      });
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
