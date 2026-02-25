import { exec as syncExec, ExecOptions } from 'child_process';
import { promisify } from 'util';

import {
  CommandExecutionError,
  ExternalServiceError,
} from '@/errors/Errors.js';

export class GitService {
  private readonly exec: (
    command: string,
    options?: ExecOptions,
  ) => Promise<{
    stdout: string;
    stderr: string;
  }>;

  private commandParts: string[];

  constructor() {
    this.exec = promisify(syncExec);
    this.commandParts = ['git', 'log'];
  }

  get command() {
    return this.commandParts.join(' ');
  }

  public pretty() {
    this.commandParts.push('--pretty=format:"- %s%n%b"');
    return this;
  }

  public customLog(command: string) {
    const cleanedCommand = command.replace(/^git\s+log\s*/i, '');
    this.commandParts.push(cleanedCommand);
    return this;
  }

  private async executeGitCommand() {
    try {
      const command = this.command;
      const cwd = process.cwd();

      const { stdout } = await this.exec(command, { cwd });

      return stdout.trim();
    } catch (error: any) {
      const errorMessage = error?.message || '';

      if (errorMessage.includes('not a git repository')) {
        throw new CommandExecutionError({
          message: 'The current directory is not a Git repository.',
          hint: 'Make sure you are in the correct directory or run "git init".',
          cause: error,
        });
      }

      if (
        error?.code === 'ENOENT' ||
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
        message: `Failed to execute git command.\nOriginal error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        cause: error,
      });
    }
  }

  public async getCommitLog() {
    const gitOutput = await this.executeGitCommand();

    if (!gitOutput) {
      return [];
    }

    const conventionalCommitHeaderRegex =
      /^- (feat|fix|build|chore|ci|docs|perf|refactor|revert|style|test)(\(.*\))?:/gim;

    const matches = [...gitOutput.matchAll(conventionalCommitHeaderRegex)];

    if (matches.length === 0) {
      return [];
    }

    const commits: string[] = [];

    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const startIndex = currentMatch.index;

      const nextMatch = matches[i + 1];
      const endIndex = nextMatch ? nextMatch.index : gitOutput.length;

      const commitMessage = gitOutput.substring(startIndex, endIndex).trim();

      if (commitMessage) {
        commits.push(commitMessage);
      }
    }

    return commits;
  }
}
