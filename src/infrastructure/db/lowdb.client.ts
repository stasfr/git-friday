import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import type { PersistedReport } from '@/infrastructure/repositories/report.mapper.js';

interface Database { reports: PersistedReport[]; }

export type LowDatabase = Low<Database>;

interface JsonDbClientDependencies { jsonDbPath: string; }

export class JsonDbClient extends Low<Database> {
  constructor(dependencies: JsonDbClientDependencies) {
    super(new JSONFile(`${dependencies.jsonDbPath}/db.json`), { reports: [] });
  }
}
