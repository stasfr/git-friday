import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import type { PersistedReport } from '@/infrastructure/repositories/report.mapper.js';

interface Database { reports: PersistedReport[]; }

export type LowDatabase = Low<Database>;

export class JsonDbClient extends Low<Database> {
  constructor(path: string) {
    super(new JSONFile(`${path}/db.json`), { reports: [] });
  }
}
