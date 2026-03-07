import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

export interface IOsPaths {
  data: string;
  config: string;
  profiles: string;
  cache: string;
  log: string;
  temp: string;
}

const PROJECT_NAME = 'git-friday';

function macos() {
  const homedir = os.homedir();
  const tmpdir = os.tmpdir();
  const library = path.join(homedir, 'Library');

  const config = path.join(library, 'Preferences', PROJECT_NAME);

  return {
    data: path.join(library, 'Application Support', PROJECT_NAME),
    config,
    profiles: path.join(config, 'profiles'),
    cache: path.join(library, 'Caches', PROJECT_NAME),
    log: path.join(library, 'Logs', PROJECT_NAME),
    temp: path.join(tmpdir, PROJECT_NAME),
  } as const satisfies IOsPaths;
}

function windows() {
  const homedir = os.homedir();
  const { env } = process;

  const appData = env.APPDATA || path.join(homedir, 'AppData', 'Roaming');
  const localAppData =
    env.LOCALAPPDATA || path.join(homedir, 'AppData', 'Local');

  const config = path.join(appData, PROJECT_NAME, 'config');

  return {
    data: path.join(localAppData, PROJECT_NAME, 'data'),
    config,
    profiles: path.join(config, 'profiles'),
    cache: path.join(localAppData, PROJECT_NAME, 'cache'),
    log: path.join(localAppData, PROJECT_NAME, 'log'),
    temp: path.join(localAppData, 'Temp', PROJECT_NAME),
  } as const satisfies IOsPaths;
}

function linux() {
  const homedir = os.homedir();
  const tmpdir = os.tmpdir();
  const { env } = process;
  const username = path.basename(homedir);

  const config = path.join(
    env.XDG_CONFIG_HOME || path.join(homedir, '.config'),
    PROJECT_NAME,
  );

  return {
    data: path.join(
      env.XDG_DATA_HOME || path.join(homedir, '.local', 'share'),
      PROJECT_NAME,
    ),
    config,
    profiles: path.join(config, 'profiles'),
    cache: path.join(
      env.XDG_CACHE_HOME || path.join(homedir, '.cache'),
      PROJECT_NAME,
    ),
    log: path.join(
      env.XDG_STATE_HOME || path.join(homedir, '.local', 'state'),
      PROJECT_NAME,
    ),
    temp: path.join(tmpdir, username, PROJECT_NAME),
  } as const satisfies IOsPaths;
}

export function getOsPaths() {
  if (process.platform === 'darwin') {
    return macos();
  }

  if (process.platform === 'win32') {
    return windows();
  }

  return linux();
}
