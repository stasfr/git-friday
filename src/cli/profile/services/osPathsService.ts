import path from 'node:path';

import { ConfigError } from '@/errors/Errors.js';

export interface IOsPaths {
  data: string;
  config: string;
  profiles: string;
  cache: string;
  log: string;
  temp: string;
}

export function getOsPaths() {
  const os = process.platform;

  if (os !== 'win32') {
    throw new ConfigError({
      message: 'Unsupported OS',
      hint: 'At this point, only Windows is supported',
    });
  }

  if (!process.env.LOCALAPPDATA || !process.env.APPDATA) {
    throw new ConfigError({
      message: 'Missing environment variables for Windows',
      hint: 'process.env.LOCALAPPDATA or process.env.APPDATA',
    });
  }

  const localAppData = process.env.LOCALAPPDATA;
  const appData = process.env.APPDATA;

  return {
    data: path.join(localAppData, '.git-friday', 'data'),
    config: path.join(appData, '.git-friday', 'config'),
    profiles: path.join(appData, '.git-friday', 'profiles'),
    cache: path.join(localAppData, '.git-friday', 'cache'),
    log: path.join(localAppData, '.git-friday', 'log'),
    temp: path.join(localAppData, 'Temp', '.git-friday'),
  } satisfies IOsPaths;
}
