import { randomUUID } from 'crypto';
import type { IdGenerator } from '@/domain/services/id-generator.interface.ts';

export class UuidGenerator implements IdGenerator {
  public generate(): string {
    return randomUUID();
  }
}
