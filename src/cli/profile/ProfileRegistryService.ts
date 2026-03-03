import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';

import {
  NotFoundError,
  ConfigError,
  ExternalServiceError,
} from '@/errors/Errors.js';
import { getErrorMessage } from '@/errors/errorHelpers.js';

import { FsService } from '@/services/fsService.js';

import { getOsPaths } from '@/cli/profile/services/osPathsService.js';
import { configIsValidProfileConfig } from '@/cli/profile/services/configValidators.js';

import type { IOsPaths } from '@/cli/profile/services/osPathsService.js';

const SERVICE_NAME = 'ProfileRegistry';

export class ProfileRegistryService {
  private osPaths: IOsPaths;
  private fsService: FsService;

  constructor() {
    this.osPaths = getOsPaths();
    this.fsService = new FsService();
  }

  public async hasProfile(profileName: string) {
    const profilePath = path.join(this.osPaths.profiles, profileName);
    return await this.fsService.hasFile(profilePath);
  }

  public async checkIfProfileExists(profileName: string) {
    const profilePath = path.join(this.osPaths.profiles, profileName);
    try {
      await this.fsService.checkIfFileExists(profilePath);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({
          message: `Profile '${profileName}' not found.`,
          hint: 'Use "friday profile create" to create a new profile.',
          cause: error,
        });
      }
      throw error;
    }
  }

  public async createProfileDir(profileName: string) {
    const profilePath = path.join(this.osPaths.profiles, profileName);
    try {
      await fs.mkdir(profilePath, { recursive: true });
    } catch (error) {
      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to create profile directory: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }

  public async listAllProfiles() {
    try {
      return await this.fsService.getDirsNames(this.osPaths.profiles);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({
          message: 'Profiles directory not found.',
          hint: 'Create a profile first using "friday profile create".',
          cause: error,
        });
      }
      throw error;
    }
  }

  public async listAllProfilesAiCompletionModels() {
    const profileDirs = await this.fsService.getDirsList(this.osPaths.profiles);
    if (profileDirs.length === 0) {
      return;
    }
    const models = new Set<string>();

    for await (const dir of profileDirs) {
      const profileConfigPath = path.join(
        dir.parentPath,
        dir.name,
        'config.json',
      );
      try {
        await fs.access(profileConfigPath, constants.F_OK);
        const configFile = await fs.readFile(profileConfigPath, 'utf-8');
        const profileConfig = JSON.parse(configFile);
        configIsValidProfileConfig(profileConfig);
        models.add(profileConfig.aiCompletionModel);
      } catch (error) {
        if (error instanceof NotFoundError) {
          continue;
        }
        if (error instanceof ConfigError) {
          continue;
        }
        continue;
      }
    }

    return [...models];
  }

  public async deleteProfile(profileName: string) {
    const profileDirPath = path.join(this.osPaths.profiles, profileName);
    try {
      await this.fsService.removeDir(profileDirPath);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({
          message: `Profile '${profileName}' not found.`,
          hint: 'Use "friday profile list" to see available profiles.',
          cause: error,
        });
      }
      throw error;
    }
  }
}
