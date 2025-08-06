import { EntityId } from '@/domain/shared/value-objects/entity-id.js';

import type { IdGenerator } from '@/domain/services/id-generator.interface.js';

export class ReportId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  public static create(generator: IdGenerator): ReportId {
    return new ReportId(generator.generate());
  }

  public static from(id: string): ReportId {
    return new ReportId(id);
  }
}
