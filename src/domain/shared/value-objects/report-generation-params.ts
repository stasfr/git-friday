import { ValidationError } from '@/domain/shared/domain.errors.js';

interface ReportGenerationParamsProps {
  authors: string[];
  branches: string[];
  since?: Date;
  until?: Date;
}

export class ReportGenerationParams {
  public readonly authors: readonly string[];

  public readonly branches: readonly string[];

  public readonly since?: Date;

  public readonly until?: Date;

  private constructor(props: ReportGenerationParamsProps) {
    this.validate(props);

    this.authors = Object.freeze(props.authors);
    this.branches = Object.freeze(props.branches);
    this.since = props.since;
    this.until = props.until;
  }

  private validate(props: ReportGenerationParamsProps): void {
    if (!props.authors || props.authors.length === 0) {
      throw new ValidationError({
        fieldName: 'authors',
        reason: 'At least one author must be specified.',
      });
    }

    if (!props.branches || props.branches.length === 0) {
      throw new ValidationError({
        fieldName: 'branches',
        reason: 'At least one branch must be specified.',
      });
    }

    if (props.since && props.until && props.since > props.until) {
      throw new ValidationError({
        fieldName: 'since/until',
        reason: 'The start date cannot be later than the end date.',
      });
    }
  }

  public static create(props: ReportGenerationParamsProps): ReportGenerationParams {
    return new ReportGenerationParams(props);
  }
}
