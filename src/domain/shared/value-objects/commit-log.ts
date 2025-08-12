export class CommitLog {
  public readonly values: readonly string[];

  private constructor(values: readonly string[]) {
    this.values = Object.freeze(values);
  }

  get value(): string {
    return this.values.join('\n');
  }

  static create(gitLogOutput: string): CommitLog {
    const trimmedOutput = gitLogOutput.trim();

    if (!trimmedOutput) {
      return new CommitLog([]);
    }

    const conventionalCommitHeaderRegex =
      /^- (feat|fix|build|chore|ci|docs|perf|refactor|revert|style|test)(\(.*\))?:/gim;

    const matches = [...trimmedOutput.matchAll(conventionalCommitHeaderRegex)];

    if (matches.length === 0) {
      return new CommitLog([]);
    }

    const commits: string[] = [];

    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const startIndex = currentMatch.index;

      const nextMatch = matches[i + 1];
      const endIndex = nextMatch
        ? nextMatch.index
        : trimmedOutput.length;

      const commitMessage = trimmedOutput.substring(startIndex, endIndex)
        .trim();

      if (commitMessage) {
        commits.push(commitMessage);
      }
    }

    return new CommitLog(commits);
  }

  static from(commits: readonly string[]): CommitLog {
    return new CommitLog(commits);
  }
}
