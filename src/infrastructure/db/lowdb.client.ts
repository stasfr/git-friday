import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import type { PersistedReport } from '@/infrastructure/repositories/report.mapper.js';

interface Database { reports: PersistedReport[]; }

export type LowDatabase = Low<Database>;

export function initializeJsonDbClient(path: string): LowDatabase {
  return new Low<Database>(new JSONFile(`${path}/db.json`), { reports: [] });
}
