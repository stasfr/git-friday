import { exec as syncExec } from 'child_process';
import { promisify } from 'util';

import {
  CommandExecutionError,
  ExternalServiceError,
} from '@/errors/Errors.js';
import { getErrorMessage, getErrorCode } from '@/errors/errorHelpers.js';

export class GitService {
  private commandParts: string[];
  private diffCommandParts: string[];

  constructor() {
    this.commandParts = ['git', 'log'];
    this.diffCommandParts = [];
  }

  get command() {
    return this.commandParts.join(' ');
  }

  private cleanCommand(command: string) {
    return command.replace(/^git\s+log\s*/i, '');
  }

  public buildCommand(command: string) {
    const cleanedCommand = this.cleanCommand(command);
    this.commandParts.push(cleanedCommand);
    this.commandParts.push('--pretty=format:COMMIT_SEPARATOR_%H%n%s%n%b');
    return this;
  }

  private async executeGitCommand() {
    try {
      const command = this.command;
      const cwd = process.cwd();
      const asyncExec = promisify(syncExec);

      const { stdout } = await asyncExec(command, { cwd });

      return stdout.trim();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      const errorCode = getErrorCode(error);

      if (errorMessage.includes('not a git repository')) {
        throw new CommandExecutionError({
          message: 'The current directory is not a Git repository.',
          hint: 'Make sure you are in the correct directory or run "git init".',
          cause: error,
        });
      }

      if (
        errorCode === 'ENOENT' ||
        errorMessage.includes('command not found')
      ) {
        throw new ExternalServiceError({
          service: 'Git',
          message: 'Git is not installed or not available in the PATH.',
          hint: 'Please install Git to use this application.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: 'Git',
        message: `Failed to execute git command.\nOriginal error: ${errorMessage}`,
        cause: error,
      });
    }
  }

  public async getCommitLog() {
    const gitOutput = await this.executeGitCommand();

    if (!gitOutput) {
      return [];
    }

    const commitSeparatorRegex = /COMMIT_SEPARATOR_[0-9a-f]{40}/g;

    const commits: string[] = [];

    const parts = gitOutput.split(commitSeparatorRegex);

    for (const part of parts) {
      const commitMessage = part.trim();

      if (commitMessage) {
        commits.push(commitMessage);
      }
    }

    return commits;
  }

  private cleanDiffCommand(command: string) {
    return command.replace(/^git\s+diff\s*/i, '');
  }

  public buildDiffCommand(command: string) {
    const cleanedCommand = this.cleanDiffCommand(command);
    this.diffCommandParts = ['git', 'diff', cleanedCommand, '--no-color'];
    return this;
  }

  private async executeDiffCommandInternal() {
    try {
      const command = this.diffCommandParts.join(' ');
      const cwd = process.cwd();
      const asyncExec = promisify(syncExec);

      const { stdout, stderr } = await asyncExec(command, { cwd });

      if (stderr) {
        throw new CommandExecutionError({
          message: `Git diff command failed: ${stderr}`,
          hint: 'Check your git diff command and try again',
        });
      }

      return stdout.trim();
    } catch (error) {
      if (error instanceof CommandExecutionError) {
        throw error;
      }

      const errorMessage = getErrorMessage(error);
      const errorCode = getErrorCode(error);

      if (errorMessage.includes('not a git repository')) {
        throw new CommandExecutionError({
          message: 'The current directory is not a Git repository.',
          hint: 'Make sure you are in the correct directory or run "git init".',
          cause: error,
        });
      }

      if (
        errorCode === 'ENOENT' ||
        errorMessage.includes('command not found')
      ) {
        throw new ExternalServiceError({
          service: 'Git',
          message: 'Git is not installed or not available in the PATH.',
          hint: 'Please install Git to use this application.',
          cause: error,
        });
      }

      throw new ExternalServiceError({
        service: 'Git',
        message: `Failed to execute git diff command.\nOriginal error: ${errorMessage}`,
        cause: error,
      });
    }
  }

  public async getDiff() {
    return await this.executeDiffCommandInternal();
  }
}
