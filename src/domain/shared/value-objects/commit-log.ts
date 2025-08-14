import { GotEmptyGitLog, NoPatternMatchFound } from '@/domain/errors/commit-log.errors.js';

export class CommitLog {
  private readonly _values: readonly string[];

  get values(): readonly string[] {
    return this._values;
  }

  get value(): string {
    return this._values.join('\n');
  }

  private constructor(values: readonly string[]) {
    this._values = Object.freeze(values);
  }

  static create(gitLogOutput: string): CommitLog {
    const trimmedOutput = gitLogOutput.trim();

    if (!trimmedOutput) {
      throw new GotEmptyGitLog();
    }

    const conventionalCommitHeaderRegex =
      /^- (feat|fix|build|chore|ci|docs|perf|refactor|revert|style|test)(\(.*\))?:/gim;

    const matches = [...trimmedOutput.matchAll(conventionalCommitHeaderRegex)];

    if (matches.length === 0) {
      throw new NoPatternMatchFound();
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
