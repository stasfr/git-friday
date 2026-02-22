import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';

import { ExtendedError } from '@/errors/ExtendedError.js';

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

  constructor(options: IProfileServiceOptions) {
    const { profileName } = options;
    const osPaths = getOsPaths();
    const profilePath = path.join(osPaths.profiles, profileName);

    this.profileName = profileName;
    this.profilePath = profilePath;
  }

  public static async listAllProfiles() {
    const osPaths = getOsPaths();
    const entries = await fs.readdir(osPaths.profiles, { withFileTypes: true });
    const profileNames = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    return profileNames;
  }

  public static async checkIfProfileExists(profileName: string) {
    const osPaths = getOsPaths();
    const profilePath = path.join(osPaths.profiles, profileName);
    try {
      await fs.access(profilePath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
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

  public async checkIfSystemPromptExists() {
    try {
      const systemPromptPath = path.join(this.profilePath, 'system-prompt.md');
      await fs.access(systemPromptPath, constants.F_OK);
      return true;
    } catch {
      return new ExtendedError({
        layer: 'ConfigurationError',
        message: 'System prompt file not found',
        command: null,
        service: null,
        hint: null,
      });
    }
  }

  public async checkIfUserPromptExists() {
    try {
      const userPromptPath = path.join(this.profilePath, 'user-prompt.md');
      await fs.access(userPromptPath, constants.F_OK);
      return true;
    } catch {
      return new ExtendedError({
        layer: 'ConfigurationError',
        message: 'User prompt file not found',
        command: null,
        service: null,
        hint: null,
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

  private async readProfileConfig() {
    const profileConfigExists = await this.checkIfProfileConfigExists();
    if (profileConfigExists instanceof ExtendedError) {
      throw profileConfigExists;
    }
    const profileConfigPath = path.join(this.profilePath, 'config.json');
    const configFile = await fs.readFile(profileConfigPath, 'utf-8');
    const profileConfig = JSON.parse(configFile);
    if (!configIsRawProfileConfig(profileConfig)) throw new Error();
    return profileConfig;
  }

  private async writeProfileConfig(
    config: IRawProfileConfig | IEmptyProfileConfig,
  ) {
    const profileConfigExists = await this.checkIfProfileConfigExists();
    if (profileConfigExists instanceof ExtendedError) {
      throw profileConfigExists;
    }
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

  public async getProfilePrompts() {
    const systemPromptExists = await this.checkIfSystemPromptExists();
    if (systemPromptExists instanceof ExtendedError) {
      throw systemPromptExists;
    }

    const userPromptExists = await this.checkIfUserPromptExists();
    if (userPromptExists instanceof ExtendedError) {
      throw userPromptExists;
    }

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
