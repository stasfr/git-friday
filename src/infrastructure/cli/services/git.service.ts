import { exec as syncExec, ExecOptions } from 'child_process';
import { promisify } from 'util';

export class GitService {
  private readonly exec: (command: string, options?: ExecOptions) => Promise<{
    stdout: string;
    stderr: string
  }>;

  private commandParts: string[];

  constructor() {
    this.exec = promisify(syncExec);
    this.commandParts = ['git', 'log'];
  }

  private reset(): this {
    this.commandParts = ['git', 'log'];

    return this;
  }

  private async getGitUserEmail(): Promise<string> {
    const { stdout } = await this.exec('git config user.email');

    return stdout.trim();
  }

  public forAuthors(authors: string[] | null | undefined): this {
    if (authors && authors.length > 0) {
      const authorArgs = authors.map((author) => `--author="${author}"`)
        .join(' ');
      this.commandParts.push(authorArgs);
    }

    return this;
  }

  public async forCurrentUser(): Promise<this> {
    const userEmail = await this.getGitUserEmail();
    this.commandParts.push(`--author="${userEmail}"`);

    return this;
  }

  public forBranches(branches: string[] | null | undefined): this {
    const branchArgs = branches && branches.length > 0
      ? branches.join(' ')
      : '--all';
    this.commandParts.push(branchArgs);

    return this;
  }

  public today(): this {
    this.commandParts.push('--since="00:00:00"');

    return this;
  }

  public pretty(): this {
    this.commandParts.push('--pretty=format:"- %s%n%b"');

    return this;
  }

  public async getCommitLog(): Promise<string> {
    const command = this.commandParts.join(' ');
    const cwd = process.cwd();

    // Reset for the next potential command build
    this.reset();

    const { stdout } = await this.exec(command, { cwd });

    return stdout;
  }
}
