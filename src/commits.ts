import { exec } from 'child_process';
import { promisify } from 'util';

const privateConstructorKey = Symbol('CommitsWorker.private');

interface CommitsWorkerProps {
  authors: string[] | string;
  branch: string;
}

export class CommitsWorker {
  #authors: string[] | string;

  #branch: string;

  private constructor(props: CommitsWorkerProps, key: symbol) {
    if (key !== privateConstructorKey) {
      throw new Error('Private constructor access error');
    }

    this.#authors = props.authors;
    this.#branch = props.branch;
  }

  static create(props: CommitsWorkerProps): CommitsWorker {
    return new CommitsWorker(props, privateConstructorKey);
  }

  private generateCliCommand(): string {
    let authorArgs: string;

    if (Array.isArray(this.#authors)) {
      authorArgs = this.#authors.map((author) => `--author="${author}"`)
        .join(' ');
    } else {
      authorArgs = `--author="${this.#authors}"`;
    }

    const command = `git log ${this.#branch} ${authorArgs} --since="00:00:00" --pretty=format:"- %s%n%b"`;

    return command;
  }

  public async getCommits(): Promise<string | null> {
    const execAsync = promisify(exec);

    const cwd = process.cwd();
    const command = this.generateCliCommand();

    const { stdout } = await execAsync(command, { cwd });

    return stdout;
  }
}
