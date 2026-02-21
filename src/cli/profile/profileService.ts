import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';

import { ExtendedError } from '@/errors/ExtendedError.js';
import { ConfigService } from '@/cli/config/configService.js';

import type {
  IProfileConfigFile,
  IProfileConfig,
  IProfilePrompts,
} from '@/cli/profile/profileTypes.js';

export class ProfileService {
  private profileName: string;
  private profilePath: string;

  constructor(configService: ConfigService, profileName: string) {
    this.profileName = profileName;
    this.profilePath = path.join(
      configService.getOsPaths().data,
      'profiles',
      this.profileName,
    );
  }

  private validateProfileConfig(config: unknown): config is IProfileConfigFile {
    if (config === null) {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Profile config file is empty',
        command: null,
        service: null,
        hint: null,
      });
    }

    if (typeof config !== 'object') {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Profile config file is not a valid JSON',
        command: null,
        service: null,
        hint: null,
      });
    }

    if (!('name' in config)) {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Profile config file is missing name property',
        command: null,
        service: null,
        hint: null,
      });
    }

    if (typeof config.name !== 'string') {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Invalid name value',
        command: null,
        service: null,
        hint: null,
      });
    }

    if (!('git_log_command' in config)) {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Profile config file is missing git_log_command property',
        command: null,
        service: null,
        hint: null,
      });
    }

    if (
      typeof config.git_log_command !== 'string' &&
      config.git_log_command !== null
    ) {
      throw new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Invalid git_log_command value',
        command: null,
        service: null,
        hint: null,
      });
    }

    return true;
  }

  public async checkIfProfileConfigExists() {
    try {
      const profileConfigPath = path.join(this.profilePath, 'config.json');
      await fs.access(profileConfigPath, constants.F_OK);
      return true;
    } catch {
      return new ExtendedError({
        layer: 'ConfigurationError',
        message: 'Profile config file not found',
        command: null,
        service: null,
        hint: null,
      });
    }
  }

  private async readProfileConfig() {
    const profileConfigExists = await this.checkIfProfileConfigExists();
    if (profileConfigExists instanceof ExtendedError) {
      throw profileConfigExists;
    }
    const profileConfigPath = path.join(this.profilePath, 'config.json');
    const configFile = await fs.readFile(profileConfigPath, 'utf-8');
    const config = JSON.parse(configFile);

    return config;
  }

  public async getValidProfileConfig() {
    const profileConfig = await this.readProfileConfig();

    if (!this.validateProfileConfig(profileConfig)) throw new Error();

    return {
      name: profileConfig.name,
      gitLogCommand: profileConfig.git_log_command,
    } satisfies IProfileConfig;
  }

  public async getProfilePrompts() {
    const systemPromptPath = path.join(this.profilePath, 'system-prompt.md');
    const userPromptPath = path.join(this.profilePath, 'user-prompt.md');

    const systemPrompt = await fs.readFile(systemPromptPath, 'utf-8');
    const userPrompt = await fs.readFile(userPromptPath, 'utf-8');

    return {
      systemPrompt,
      userPrompt,
    } satisfies IProfilePrompts;
  }
}
