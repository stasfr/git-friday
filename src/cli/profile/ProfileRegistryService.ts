import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';

import { FsService } from '@/services/fsService.js';

import { getOsPaths } from '@/cli/profile/services/osPathsService.js';
import { configIsValidProfileConfig } from '@/cli/profile/services/configValidators.js';

import type { IOsPaths } from '@/cli/profile/services/osPathsService.js';

export class ProfileRegistryService {
  private osPaths: IOsPaths;
  private fsService: FsService;

  constructor() {
    this.osPaths = getOsPaths();
    this.fsService = new FsService();
  }

  public async hasProfile(profileName: string): Promise<boolean> {
    const profilePath = path.join(this.osPaths.profiles, profileName);
    return await this.fsService.hasFile(profilePath);
  }

  public async checkIfProfileExists(profileName: string): Promise<void> {
    const profilePath = path.join(this.osPaths.profiles, profileName);
    await this.fsService.checkIfFileExists(profilePath);
  }

  public async createProfileDir(profileName: string): Promise<void> {
    const profilePath = path.join(this.osPaths.profiles, profileName);
    await fs.mkdir(profilePath, { recursive: true });
  }

  public async listAllProfiles() {
    return await this.fsService.getDirsNames(this.osPaths.profiles);
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
      } catch {
        continue;
      }
    }

    return [...models];
  }

  public async deleteProfile(profileName: string) {
    const profileDirPath = path.join(this.osPaths.profiles, profileName);
    await this.fsService.removeDir(profileDirPath);
  }
}
