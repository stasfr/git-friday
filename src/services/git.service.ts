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

  private reset() {
    this.commandParts = ['git', 'log'];
    return this;
  }

  private async getGitUserEmail() {
    const { stdout } = await this.exec('git config user.email');
    return stdout.trim();
  }

  public forAuthors(authors: string[]) {
    const authorArgs = authors
      .map((author) => `--author="${author}"`)
      .join(' ');
    this.commandParts.push(authorArgs);
    return this;
  }

  public async forCurrentUser() {
    const userEmail = await this.getGitUserEmail();
    this.commandParts.push(`--author="${userEmail}"`);
    return this;
  }

  public forBranches(branches: string[]) {
    const branchArgs = branches.join(' ');
    this.commandParts.push(branchArgs);
    return this;
  }

  public forAllBranches() {
    this.commandParts.push('--all');
    return this;
  }

  public today() {
    this.commandParts.push('--since="00:00:00"');
    return this;
  }

  public pretty() {
    this.commandParts.push('--pretty=format:"- %s%n%b"');
    return this;
  }

  public since(date: string) {
    this.commandParts.push(`--since="${date}"`);
    return this;
  }

  public until(date: string) {
    this.commandParts.push(`--until="${date}"`);
    return this;
  }

  public forRange(range: string) {
    this.commandParts.push(range);
    return this;
  }

  public sinceTag(tag: string) {
    this.commandParts.push(`${tag}..`);
    return this;
  }

  public async getCommitLog() {
    const command = this.command;
    const cwd = process.cwd();

    // Reset for the next potential command build
    this.reset();

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
