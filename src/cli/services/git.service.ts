import { exec as syncExec, ExecOptions } from 'child_process';
import { promisify } from 'util';

interface GetCommitLogParams {
  authors: string[] | null | undefined;
  branches: string[] | null | undefined;
  currentUser: boolean;
}

export class GitService {
  private readonly exec: (command: string, options?: ExecOptions) => Promise<{
    stdout: string;
    stderr: string
  }>;

  constructor() {
    this.exec = promisify(syncExec);
  }

  private async getGitUserEmail(): Promise<string> {
    const { stdout } = await this.exec('git config user.email');

    return stdout.trim();
  }

  public async getCommitLog(params: GetCommitLogParams): Promise<string> {
    let authorArgs = '';

    if (params.authors && params.authors.length > 0) {
      authorArgs = params.authors
        .map((author) => `--author="${author}"`)
        .join(' ');
    } else if (params.currentUser) {
      const userEmail = await this.getGitUserEmail();
      authorArgs = `--author="${userEmail}"`;
    }

    const branchArgs =
      params.branches && params.branches.length > 0
        ? params.branches.join(' ')
        : '--all';

    const commandParts = ['git', 'log', branchArgs];

    if (authorArgs) {
      commandParts.push(authorArgs);
    }

    commandParts.push('--since="00:00:00"');
    commandParts.push('--pretty=format:"- %s%n%b"');

    const command = commandParts.join(' ');

    const cwd = process.cwd();

    const { stdout } = await this.exec(command, { cwd });

    return stdout;
  }
}
