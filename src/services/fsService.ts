import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';

import { ExtendedError } from '@/errors/ExtendedError.js';

const SERVICE_NAME = 'FsService';

export class FsService {
  public async checkIfFileExists(filePath: string) {
    const resolvedPath = path.resolve(filePath);
    try {
      await fs.access(resolvedPath, constants.F_OK);
    } catch {
      throw new ExtendedError({
        layer: 'InternalError',
        message: 'File not found',
        command: null,
        service: SERVICE_NAME,
        hint: null,
      });
    }
  }

  public async hasFile(filePath: string) {
    const resolvedPath = path.resolve(filePath);
    try {
      await fs.access(resolvedPath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  public async getDirsList(dirPath: string) {
    const resolvedPath = path.resolve(dirPath);
    try {
      const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
      return entries.filter((entry) => entry.isDirectory());
    } catch (error) {
      throw new ExtendedError({
        layer: 'InternalError',
        message: `Got error in getDirsList: ${error instanceof Error ? error.message : 'Unknown error'}`,
        command: null,
        service: SERVICE_NAME,
        hint: null,
      });
    }
  }

  public async getDirsNames(dirPath: string) {
    const resolvedPath = path.resolve(dirPath);
    try {
      const dirs = await this.getDirsList(resolvedPath);
      return dirs.map((entry) => entry.name);
    } catch (error) {
      throw new ExtendedError({
        layer: 'InternalError',
        message: `Got error in getDirsNames: ${error instanceof Error ? error.message : 'Unknown error'}`,
        command: null,
        service: SERVICE_NAME,
        hint: null,
      });
    }
  }

  public async removeDir(dirPath: string) {
    const resolvedPath = path.resolve(dirPath);
    try {
      await fs.rm(resolvedPath, { recursive: true, force: true });
    } catch (error) {
      throw new ExtendedError({
        layer: 'InternalError',
        message: `Got error in removeDir: ${error instanceof Error ? error.message : 'Unknown error'}`,
        command: null,
        service: SERVICE_NAME,
        hint: null,
      });
    }
  }

  public async removeFile(filePath: string) {
    const resolvedPath = path.resolve(filePath);
    try {
      await fs.rm(resolvedPath);
    } catch (error) {
      throw new ExtendedError({
        layer: 'InternalError',
        message: `Got error in removeFile: ${error instanceof Error ? error.message : 'Unknown error'}`,
        command: null,
        service: SERVICE_NAME,
        hint: null,
      });
    }
  }

  public async copyFile(srcPath: string, destPath: string) {
    const resolvedSrcPath = path.resolve(srcPath);
    const resolvedDestPath = path.resolve(destPath);
    try {
      await fs.copyFile(resolvedSrcPath, resolvedDestPath);
    } catch (error) {
      throw new ExtendedError({
        layer: 'InternalError',
        message: `Got error in copyFile: ${error instanceof Error ? error.message : 'Unknown error'}`,
        command: null,
        service: SERVICE_NAME,
        hint: null,
      });
    }
  }
}
