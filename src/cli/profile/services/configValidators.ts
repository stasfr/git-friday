import { ExtendedError } from '@/errors/ExtendedError.js';

import type { IProfileConfigFile } from '@/cli/profile/profileTypes.js';

export function validateProfileConfig(
  config: unknown,
): config is IProfileConfigFile {
  if (config === null) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Profile config file is empty',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (typeof config !== 'object') {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Profile config file is not a valid JSON',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (!('name' in config)) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Profile config file is missing name property',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (typeof config.name !== 'string') {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Invalid name value',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (!('git_log_command' in config)) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Profile config file is missing git_log_command property',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (
    typeof config.git_log_command !== 'string' &&
    config.git_log_command !== null
  ) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Invalid git_log_command value',
      command: null,
      service: null,
      hint: null,
    });
  }

  return true;
}
