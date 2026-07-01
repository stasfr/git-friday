import * as v from 'valibot';

import { ConfigError } from '@/errors/Errors.js';

import {
  rawProfileConfigSchema,
  validProfileConfigSchema,
} from '@/cli/profile/profileTypes.js';

import type {
  IRawProfileConfig,
  IValidProfileConfig,
} from '@/cli/profile/profileTypes.js';

function issuesToMessage(issues: readonly v.BaseIssue<unknown>[]): string {
  return issues
    .map((issue) => {
      const dotPath = v.getDotPath(issue);
      return dotPath ? `${dotPath}: ${issue.message}` : issue.message;
    })
    .join('; ');
}

export function configIsValidProfileConfig(
  config: unknown,
): asserts config is IValidProfileConfig {
  const result = v.safeParse(validProfileConfigSchema, config);
  if (!result.success) {
    throw new ConfigError({
      message: `Invalid profile config: ${issuesToMessage(result.issues)}`,
    });
  }
}

export function configIsRawProfileConfig(
  config: unknown,
): asserts config is IRawProfileConfig {
  const result = v.safeParse(rawProfileConfigSchema, config);
  if (!result.success) {
    throw new ConfigError({
      message: `Invalid profile config: ${issuesToMessage(result.issues)}`,
    });
  }
}
