import { ExtendedError } from '@/errors/ExtendedError.js';

import type {
  IRawProfileConfig,
  IValidProfileConfig,
} from '@/cli/profile/profileTypes.js';

export function configIsValidProfileConfig(
  config: unknown,
): config is IValidProfileConfig {
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

  if (config.name === null) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Missing name value in profile config file',
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

  if (!('gitLogCommand' in config)) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Profile config file is missing gitLogCommand property',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (
    typeof config.gitLogCommand !== 'string' &&
    config.gitLogCommand !== null
  ) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Invalid gitLogCommand value',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (!('aiCompletionModel' in config)) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Profile config file is missing aiCompletionModel property',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (config.aiCompletionModel === null) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Missing aiCompletionModel value in profile config file',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (typeof config.aiCompletionModel !== 'string') {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Invalid aiCompletionModel value',
      command: null,
      service: null,
      hint: null,
    });
  }

  return true;
}

export function configIsRawProfileConfig(
  config: unknown,
): config is IRawProfileConfig {
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

  if (config.name === null) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Missing name value in profile config file',
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

  if (!('gitLogCommand' in config)) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Profile config file is missing gitLogCommand property',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (
    typeof config.gitLogCommand !== 'string' &&
    config.gitLogCommand !== null
  ) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Invalid gitLogCommand value',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (!('aiCompletionModel' in config)) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Profile config file is missing aiCompletionModel property',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (
    typeof config.aiCompletionModel !== 'string' &&
    config.aiCompletionModel !== null
  ) {
    throw new ExtendedError({
      layer: 'ConfigurationError',
      message: 'Invalid aiCompletionModel value',
      command: null,
      service: null,
      hint: null,
    });
  }

  return true;
}
