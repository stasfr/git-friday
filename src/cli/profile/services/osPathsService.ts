import path from 'node:path';

import { ExtendedError } from '@/errors/ExtendedError.js';

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
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Unsupported OS',
      command: null,
      service: null,
      hint: 'At this point, only Windows is supported',
    });
  }

  if (!process.env.LOCALAPPDATA || !process.env.APPDATA) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Missing environment variables for Windows',
      command: null,
      service: null,
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
