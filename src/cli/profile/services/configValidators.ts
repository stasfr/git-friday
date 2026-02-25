import { ConfigError } from '@/errors/Errors.js';

import type {
  IRawProfileConfig,
  IValidProfileConfig,
} from '@/cli/profile/profileTypes.js';

export function configIsValidProfileConfig(
  config: unknown,
): asserts config is IValidProfileConfig {
  if (config === null) {
    throw new ConfigError({
      message: 'Profile config file is empty',
    });
  }

  if (typeof config !== 'object') {
    throw new ConfigError({
      message: 'Profile config file is not a valid JSON',
    });
  }

  if (!('name' in config)) {
    throw new ConfigError({
      message: 'Profile config file is missing name property',
    });
  }

  if (config.name === null) {
    throw new ConfigError({
      message: 'Missing name value in profile config file',
    });
  }

  if (typeof config.name !== 'string') {
    throw new ConfigError({
      message: 'Invalid name value',
    });
  }

  if (!('gitLogCommand' in config)) {
    throw new ConfigError({
      message: 'Profile config file is missing gitLogCommand property',
    });
  }

  if (
    typeof config.gitLogCommand !== 'string' &&
    config.gitLogCommand !== null
  ) {
    throw new ConfigError({
      message: 'Invalid gitLogCommand value',
    });
  }

  if (!('aiCompletionModel' in config)) {
    throw new ConfigError({
      message: 'Profile config file is missing aiCompletionModel property',
    });
  }

  if (config.aiCompletionModel === null) {
    throw new ConfigError({
      message: 'Missing aiCompletionModel value in profile config file',
    });
  }

  if (typeof config.aiCompletionModel !== 'string') {
    throw new ConfigError({
      message: 'Invalid aiCompletionModel value',
    });
  }
}

export function configIsRawProfileConfig(
  config: unknown,
): asserts config is IRawProfileConfig {
  if (config === null) {
    throw new ConfigError({
      message: 'Profile config file is empty',
    });
  }

  if (typeof config !== 'object') {
    throw new ConfigError({
      message: 'Profile config file is not a valid JSON',
    });
  }

  if (!('name' in config)) {
    throw new ConfigError({
      message: 'Profile config file is missing name property',
    });
  }

  if (config.name === null) {
    throw new ConfigError({
      message: 'Missing name value in profile config file',
    });
  }

  if (typeof config.name !== 'string') {
    throw new ConfigError({
      message: 'Invalid name value',
    });
  }

  if (!('gitLogCommand' in config)) {
    throw new ConfigError({
      message: 'Profile config file is missing gitLogCommand property',
    });
  }

  if (
    typeof config.gitLogCommand !== 'string' &&
    config.gitLogCommand !== null
  ) {
    throw new ConfigError({
      message: 'Invalid gitLogCommand value',
    });
  }

  if (!('aiCompletionModel' in config)) {
    throw new ConfigError({
      message: 'Profile config file is missing aiCompletionModel property',
    });
  }

  if (
    typeof config.aiCompletionModel !== 'string' &&
    config.aiCompletionModel !== null
  ) {
    throw new ConfigError({
      message: 'Invalid aiCompletionModel value',
    });
  }
}
