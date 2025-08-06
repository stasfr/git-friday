import { EntityId } from '@/domain/shared/value-objects/entity-id.js';

import type { IdGenerator } from '@/domain/services/id-generator.interface.js';

export class StatisticId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  public static create(generator: IdGenerator): StatisticId {
    return new StatisticId(generator.generate());
  }

  public static from(id: string): StatisticId {
    return new StatisticId(id);
  }
}
