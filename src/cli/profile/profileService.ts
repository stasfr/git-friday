import path from 'node:path';
import fs from 'node:fs/promises';

import { ExtendedError } from '@/errors/ExtendedError.js';
import { FsService } from '@/services/fsService.js';

import { getOsPaths } from '@/cli/profile/services/osPathsService.js';
import {
  configIsValidProfileConfig,
  configIsRawProfileConfig,
} from '@/cli/profile/services/configValidators.js';

import type {
  IEmptyProfileConfig,
  IRawProfileConfig,
  IRawProfileConfigKeys,
  IValidProfileConfig,
  IProfilePrompts,
} from '@/cli/profile/profileTypes.js';

interface IProfileServiceOptions {
  profileName: string;
}

export class ProfileService {
  private profileName: string;
  private profilePath: string;
  private osPaths = getOsPaths();
  private fsService = new FsService();

  constructor(options: IProfileServiceOptions) {
    this.profileName = options.profileName;
    this.profilePath = path.join(this.osPaths.profiles, options.profileName);
  }

  public async hasProfile() {
    return await this.fsService.hasFile(this.profilePath);
  }

  public async checkIfProfileExists() {
    await this.fsService.checkIfFileExists(this.profilePath);
  }

  public async hasProfileConfigFile() {
    const profileConfigPath = path.join(this.profilePath, 'config.json');
    return await this.fsService.hasFile(profileConfigPath);
  }

  public async checkIfProfileConfigExists() {
    const profileConfigPath = path.join(this.profilePath, 'config.json');
    await this.fsService.checkIfFileExists(profileConfigPath);
  }

  public async hasSystemPromptFile() {
    const systemPromptPath = path.join(this.profilePath, 'system-prompt.md');
    return await this.fsService.hasFile(systemPromptPath);
  }

  public async checkIfSystemPromptExists() {
    const systemPromptPath = path.join(this.profilePath, 'system-prompt.md');
    await this.fsService.checkIfFileExists(systemPromptPath);
  }

  public async hasUserPromptFile() {
    const userPromptPath = path.join(this.profilePath, 'user-prompt.md');
    return await this.fsService.hasFile(userPromptPath);
  }

  public async checkIfUserPromptExists() {
    const userPromptPath = path.join(this.profilePath, 'user-prompt.md');
    await this.fsService.checkIfFileExists(userPromptPath);
  }

  public async importSystemPrompt(sourcePath: string) {
    try {
      const destinationPath = path.join(this.profilePath, 'system-prompt.md');
      await fs.copyFile(sourcePath, destinationPath);
    } catch (error) {
      let errorMessage = 'Unknown error';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: `Failed to import system prompt: ${errorMessage}`,
        command: null,
        service: 'ProfileService',
        hint: 'Ensure the source file exists and you have read permissions.',
      });
    }
  }

  public async importUserPrompt(sourcePath: string) {
    try {
      const destinationPath = path.join(this.profilePath, 'user-prompt.md');
      await fs.copyFile(sourcePath, destinationPath);
    } catch (error) {
      let errorMessage = 'Unknown error';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: `Failed to import user prompt: ${errorMessage}`,
        command: null,
        service: 'ProfileService',
        hint: 'Ensure the source file exists and you have read permissions.',
      });
    }
  }

  public async initProfileWithConfig() {
    await fs.mkdir(this.profilePath, { recursive: true });

    const emptyConfig = {
      name: this.profileName,
      gitLogCommand: null,
      aiCompletionModel: null,
    } satisfies IEmptyProfileConfig;

    const configPath = path.join(this.profilePath, 'config.json');
    await fs.writeFile(
      configPath,
      JSON.stringify(emptyConfig, null, 2),
      'utf-8',
    );
  }

  public async deleteProfile() {
    await fs.rm(this.profilePath, { recursive: true, force: true });
  }

  private async readProfileConfig() {
    const profileConfigPath = path.join(this.profilePath, 'config.json');
    const configFile = await fs.readFile(profileConfigPath, 'utf-8');
    const profileConfig = JSON.parse(configFile);
    if (!configIsRawProfileConfig(profileConfig)) throw new Error();
    return profileConfig;
  }

  private async writeProfileConfig(
    config: IRawProfileConfig | IEmptyProfileConfig,
  ) {
    await this.checkIfProfileConfigExists();
    const profileConfigPath = path.join(this.profilePath, 'config.json');
    await fs.writeFile(
      profileConfigPath,
      JSON.stringify(config, null, 2),
      'utf-8',
    );
  }

  public async setValueToKey(key: IRawProfileConfigKeys, value: string) {
    const profileConfig = await this.readProfileConfig();
    profileConfig[key] = value;
    await this.writeProfileConfig(profileConfig);
  }

  public async getValueFromKey(key: IRawProfileConfigKeys) {
    const config = await this.readProfileConfig();
    return config[key];
  }

  public async getRawProfileConfig() {
    const profileConfig = await this.readProfileConfig();
    if (!configIsRawProfileConfig(profileConfig)) throw new Error();
    return profileConfig;
  }

  public async getValidProfileConfig() {
    const profileConfig = await this.readProfileConfig();

    if (!configIsValidProfileConfig(profileConfig)) throw new Error();

    return {
      name: profileConfig.name,
      gitLogCommand: profileConfig.gitLogCommand,
      aiCompletionModel: profileConfig.aiCompletionModel,
    } satisfies IValidProfileConfig;
  }

  public async getProfileSystemPrompt() {
    const systemPromptPath = path.join(this.profilePath, 'system-prompt.md');
    try {
      return await fs.readFile(systemPromptPath, 'utf-8');
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        throw new ExtendedError({
          layer: 'ConfigurationError',
          message: 'System prompt file not found',
          command: null,
          service: 'ProfileService',
          hint: 'Ensure system-prompt.md exists in profile directory',
        });
      }
      throw error;
    }
  }

  public async getProfileUserPrompt() {
    const userPromptPath = path.join(this.profilePath, 'user-prompt.md');
    try {
      return await fs.readFile(userPromptPath, 'utf-8');
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        throw new ExtendedError({
          layer: 'ConfigurationError',
          message: 'User prompt file not found',
          command: null,
          service: 'ProfileService',
          hint: 'Ensure user-prompt.md exists in profile directory',
        });
      }
      throw error;
    }
  }

  public async getProfilePrompts() {
    const systemPrompt = await this.getProfileSystemPrompt();
    const userPrompt = await this.getProfileUserPrompt();

    return {
      systemPrompt,
      userPrompt,
    } as const satisfies IProfilePrompts;
  }
}
