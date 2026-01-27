import { ValidationError } from '@/domain/shared/domain.errors.js';

export interface ReportGenerationParamsProps {
  authors?: readonly string[];
  branches?: readonly string[];
  since?: Date;
  until?: Date;
  llmModelName: string;
  llmProvider: string;
}

export class ReportGenerationParams {
  private readonly _authors?: readonly string[];

  private readonly _branches?: readonly string[];

  private readonly _since?: Date;

  private readonly _until?: Date;

  private readonly _llmModelName: string;

  private readonly _llmProvider: string;

  get authors(): readonly string[] | undefined {
    return this._authors;
  }

  get branches(): readonly string[] | undefined {
    return this._branches;
  }

  get since(): Date | undefined {
    return this._since;
  }

  get until(): Date | undefined {
    return this._until;
  }

  get llmModelName(): string {
    return this._llmModelName;
  }

  get llmProvider(): string {
    return this._llmProvider;
  }

  private constructor(props: ReportGenerationParamsProps) {
    this.validate(props);

    this._authors = props.authors ? Object.freeze(props.authors) : undefined;
    this._branches = props.branches ? Object.freeze(props.branches) : undefined;
    this._since = props.since;
    this._until = props.until;
    this._llmModelName = props.llmModelName;
    this._llmProvider = props.llmProvider;
  }

  private validate(props: ReportGenerationParamsProps): void {
    if (props.since && props.until && props.since > props.until) {
      throw new ValidationError({
        fieldName: 'since/until',
        reason: 'The start date cannot be later than the end date.',
      });
    }

    if (!props.llmModelName) {
      throw new ValidationError({
        fieldName: 'llmModelName',
        reason: 'The LLM model name must be specified.',
      });
    }

    if (!props.llmProvider) {
      throw new ValidationError({
        fieldName: 'llmProvider',
        reason: 'The LLM provider must be specified.',
      });
    }
  }

  public static create(
    props: ReportGenerationParamsProps,
  ): ReportGenerationParams {
    return new ReportGenerationParams(props);
  }
}
