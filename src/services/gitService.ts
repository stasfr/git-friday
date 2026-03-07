import { exec as syncExec } from 'child_process';
import { promisify } from 'util';

import {
  CommandExecutionError,
  ExternalServiceError,
} from '@/errors/Errors.js';
import { getErrorMessage, getErrorCode } from '@/errors/errorHelpers.js';

export class GitService {
  private commandParts: string[];

  constructor() {
    this.commandParts = ['git', 'log'];
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
}
