import { exec } from 'child_process';
import { promisify } from 'util';

interface GetCommitLogParams {
  authors: string[];
  branches: string[];
}

export class GitService {
  public async getCommitLog(params: GetCommitLogParams): Promise<string> {
    const authorArgs = params.authors.map((author) => `--author="${author}"`)
      .join(' ');
    const branchArgs = params.branches.join(' ');

    const command = `git log ${branchArgs} ${authorArgs} --since="00:00:00" --pretty=format:"- %s%n%b"`;

    const execAsync = promisify(exec);

    const cwd = process.cwd();

    const { stdout } = await execAsync(command, { cwd });

    return stdout;
  }
}
