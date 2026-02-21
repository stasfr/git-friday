import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';

import { ExtendedError } from '@/errors/ExtendedError.js';

import { getOsPaths } from '@/cli/profile/services/osPathsService.js';
import { validateProfileConfig } from '@/cli/profile/services/configValidators.js';

import type { IOsPaths } from '@/cli/profile/services/osPathsService.js';
import type {
  IEmptyProfileConfig,
  IProfileConfigFile,
  IProfileConfig,
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
    const profilePath = path.join(osPaths.config, 'profiles', profileName);

    this.profileName = profileName;
    this.profilePath = profilePath;
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

  public async initProfileWithConfig() {
    await fs.mkdir(this.profilePath, { recursive: true });

    const emptyConfig = {
      name: this.profileName,
      git_log_command: null,
      ai_completion_model: null,
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
    return profileConfig;
  }

  private async writeProfileConfig(
    config: IProfileConfigFile | IEmptyProfileConfig,
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

  public async setValueToKey(key: string, value: string) {
    const profileConfig = await this.readProfileConfig();
    profileConfig[key] = value;
    await this.writeProfileConfig(profileConfig);
  }

  public async getValueFromKey(key: keyof IProfileConfigFile) {
    const config = await this.readProfileConfig();
    return config[key];
  }

  public async getRawProfileConfig() {
    const config = await this.readProfileConfig();
    return config;
  }

  public async getValidProfileConfig() {
    const profileConfig = await this.readProfileConfig();

    if (!validateProfileConfig(profileConfig)) throw new Error();

    return {
      name: profileConfig.name,
      gitLogCommand: profileConfig.git_log_command,
      aiCompletionModel: profileConfig.ai_completion_model,
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
