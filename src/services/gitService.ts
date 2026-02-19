import { exec as syncExec, ExecOptions } from 'child_process';
import { promisify } from 'util';

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

  public async getCommitLog() {
    const command = this.command;
    const cwd = process.cwd();

    const { stdout } = await this.exec(command, { cwd });
    const trimmedOutput = stdout.trim();

    if (!trimmedOutput) {
      return [];
    }

    const conventionalCommitHeaderRegex =
      /^- (feat|fix|build|chore|ci|docs|perf|refactor|revert|style|test)(\(.*\))?:/gim;

    const matches = [...trimmedOutput.matchAll(conventionalCommitHeaderRegex)];

    if (matches.length === 0) {
      return [];
    }

    const commits: string[] = [];

    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const startIndex = currentMatch.index;

      const nextMatch = matches[i + 1];
      const endIndex = nextMatch ? nextMatch.index : trimmedOutput.length;

      const commitMessage = trimmedOutput
        .substring(startIndex, endIndex)
        .trim();

      if (commitMessage) {
        commits.push(commitMessage);
      }
    }

    return commits;
  }
}
