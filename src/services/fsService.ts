import path from 'node:path';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';

import { NotFoundError, ExternalServiceError } from '@/errors/Errors.js';
import { getErrorMessage, getErrorCode } from '@/errors/errorHelpers.js';

const SERVICE_NAME = 'FileSystem';

export class FsService {
  public async checkIfFileExists(filePath: string) {
    const resolvedPath = path.resolve(filePath);
    try {
      await fs.access(resolvedPath, constants.F_OK);
    } catch (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === 'ENOENT') {
        throw new NotFoundError({
          message: `File not found: ${filePath}`,
          hint: 'Check the file path and try again.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to check if file exists: ${getErrorMessage(error)}`,
        cause: error,
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
      const errorCode = getErrorCode(error);

      if (errorCode === 'ENOENT') {
        throw new NotFoundError({
          message: `Directory not found: ${dirPath}`,
          hint: 'Check the directory path and try again.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to list directory contents: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }

  public async getDirsNames(dirPath: string) {
    const resolvedPath = path.resolve(dirPath);
    const dirs = await this.getDirsList(resolvedPath);
    return dirs.map((entry) => entry.name);
  }

  public async removeDir(dirPath: string) {
    const resolvedPath = path.resolve(dirPath);
    try {
      await fs.rm(resolvedPath, { recursive: true, force: true });
    } catch (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === 'ENOENT') {
        throw new NotFoundError({
          message: `Directory not found: ${dirPath}`,
          hint: 'Check the directory path and try again.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to remove directory: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }

  public async removeFile(filePath: string) {
    const resolvedPath = path.resolve(filePath);
    try {
      await fs.rm(resolvedPath);
    } catch (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === 'ENOENT') {
        throw new NotFoundError({
          message: `File not found: ${filePath}`,
          hint: 'Check the file path and try again.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to remove file: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }

  public async copyFile(srcPath: string, destPath: string) {
    const resolvedSrcPath = path.resolve(srcPath);
    const resolvedDestPath = path.resolve(destPath);
    try {
      await fs.copyFile(resolvedSrcPath, resolvedDestPath);
    } catch (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === 'ENOENT') {
        throw new NotFoundError({
          message: `Source file not found: ${srcPath}`,
          hint: 'Check the source file path and try again.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to copy file: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }

  public async writeFile(dirPath: string, fileName: string, content: string) {
    const resolvedDir = path.resolve(dirPath);
    const filePath = path.join(resolvedDir, fileName);
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return filePath;
    } catch (error) {
      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to write file: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }

  public async readFile(filePath: string, encoding: BufferEncoding = 'utf-8') {
    const resolvedPath = path.resolve(filePath);
    try {
      return await fs.readFile(resolvedPath, encoding);
    } catch (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === 'ENOENT') {
        throw new NotFoundError({
          message: `File not found: ${filePath}`,
          hint: 'Check the file path and try again.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: SERVICE_NAME,
        message: `Failed to read file: ${getErrorMessage(error)}`,
        cause: error,
      });
    }
  }
}
