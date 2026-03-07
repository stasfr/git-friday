import path from 'node:path';

import {
  NotFoundError,
  ConfigError,
  ExternalServiceError,
} from '@/errors/Errors.js';
import { getErrorMessage, getErrorCode } from '@/errors/errorHelpers.js';

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
  IProfilePrompts,
} from '@/cli/profile/profileTypes.js';

interface IProfileServiceOptions {
  profileName: string;
}

const SERVICE_NAME = 'ProfileService';

export class ProfileService {
  private profileName: string;
  private profilePath: string;
  private osPaths = getOsPaths();
  private fsService = new FsService();

  constructor(options: IProfileServiceOptions) {
    this.profileName = options.profileName;
    this.profilePath = path.join(this.osPaths.profiles, options.profileName);
  }

  public async hasProfileConfigFile() {
    const profileConfigPath = path.join(this.profilePath, 'config.json');
    return await this.fsService.hasFile(profileConfigPath);
  }

  public async checkIfProfileConfigExists() {
    const profileConfigPath = path.join(this.profilePath, 'config.json');
    try {
      await this.fsService.checkIfFileExists(profileConfigPath);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({
          message: `Profile config not found for '${this.profileName}'.`,
          hint: 'Run "friday profile init" to initialize the profile config.',
          cause: error,
        });
      }
      throw error;
    }
  }

  public async hasSystemPromptFile() {
    const systemPromptPath = path.join(this.profilePath, 'system-prompt.md');
    return await this.fsService.hasFile(systemPromptPath);
  }

  public async checkIfSystemPromptExists() {
    const systemPromptPath = path.join(this.profilePath, 'system-prompt.md');
    try {
      await this.fsService.checkIfFileExists(systemPromptPath);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({
          message: `System prompt not found for profile '${this.profileName}'.`,
          hint: 'Use "friday profile import system-prompt" to add one.',
          cause: error,
        });
      }
      throw error;
    }
  }

  public async hasUserPromptFile() {
    const userPromptPath = path.join(this.profilePath, 'user-prompt.md');
    return await this.fsService.hasFile(userPromptPath);
  }

  public async checkIfUserPromptExists() {
    const userPromptPath = path.join(this.profilePath, 'user-prompt.md');
    try {
      await this.fsService.checkIfFileExists(userPromptPath);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({
          message: `User prompt not found for profile '${this.profileName}'.`,
          hint: 'Use "friday profile import user-prompt" to add one.',
          cause: error,
        });
      }
      throw error;
    }
  }

  public async importSystemPrompt(sourcePath: string) {
    const destinationPath = path.join(this.profilePath, 'system-prompt.md');
    try {
      await this.fsService.copyFile(sourcePath, destinationPath);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({
          message: `Source system prompt file not found: ${sourcePath}`,
          hint: 'Check the source path and try again.',
          cause: error,
        });
      }
      throw error;
    }
  }

  public async importUserPrompt(sourcePath: string) {
    const destinationPath = path.join(this.profilePath, 'user-prompt.md');
    try {
      await this.fsService.copyFile(sourcePath, destinationPath);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({
          message: `Source user prompt file not found: ${sourcePath}`,
          hint: 'Check the source path and try again.',
          cause: error,
        });
      }
      throw error;
    }
  }

  public async initConfig() {
    const emptyConfig = {
      name: this.profileName,
      gitLogCommand: null,
      aiCompletionModel: null,
    } satisfies IEmptyProfileConfig;

    try {
      await this.fsService.writeFile(
        this.profilePath,
        'config.json',
        JSON.stringify(emptyConfig, null, 2),
      );
    } catch (error) {
      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to initialize profile config: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }

  private async readProfileConfig() {
    const profileConfigPath = path.join(this.profilePath, 'config.json');
    try {
      const configFile = await this.fsService.readFile(
        profileConfigPath,
        'utf-8',
      );
      const profileConfig = JSON.parse(configFile);
      configIsRawProfileConfig(profileConfig);
      return profileConfig;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({
          message: `Profile config not found for '${this.profileName}'.`,
          hint: 'Run "friday profile init" to initialize the config.',
          cause: error,
        });
      }
      if (error instanceof ConfigError) {
        throw error;
      }
      throw new ConfigError({
        message: `Failed to parse profile config: ${getErrorMessage(error)}`,
        hint: 'Ensure config.json contains valid JSON.',
        cause: error,
      });
    }
  }

  private async writeProfileConfig(
    config: IRawProfileConfig | IEmptyProfileConfig,
  ) {
    try {
      await this.fsService.writeFile(
        this.profilePath,
        'config.json',
        JSON.stringify(config, null, 2),
      );
    } catch (error) {
      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to write profile config: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
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
    return profileConfig;
  }

  public async getValidProfileConfig() {
    const profileConfig = await this.readProfileConfig();
    configIsValidProfileConfig(profileConfig);
    return profileConfig;
  }

  public async getProfileSystemPrompt() {
    const systemPromptPath = path.join(this.profilePath, 'system-prompt.md');
    try {
      return await this.fsService.readFile(systemPromptPath, 'utf-8');
    } catch (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === 'ENOENT') {
        throw new NotFoundError({
          message: `System prompt file not found for profile '${this.profileName}'.`,
          hint: 'Use "friday profile import system-prompt" to add one.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to read system prompt: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }

  public async getProfileUserPrompt() {
    const userPromptPath = path.join(this.profilePath, 'user-prompt.md');
    try {
      return await this.fsService.readFile(userPromptPath, 'utf-8');
    } catch (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === 'ENOENT') {
        throw new NotFoundError({
          message: `User prompt file not found for profile '${this.profileName}'.`,
          hint: 'Use "friday profile import user-prompt" to add one.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to read user prompt: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }

  public async getProfilePrompts() {
    const [systemPrompt, userPrompt] = await Promise.all([
      this.getProfileSystemPrompt(),
      this.getProfileUserPrompt(),
    ]);

    return {
      systemPrompt,
      userPrompt,
    } as const satisfies IProfilePrompts;
  }
}
