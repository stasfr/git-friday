import type { AppConfig } from '@/config/config.types.js';

export function loadAppConfig() {
  const openRouterApiKey = process.env.OPEN_ROUTER_API_KEY;

  if (!openRouterApiKey) {
    throw new Error(
      'Missing required environment variable: OPEN_ROUTER_API_KEY',
    );
  }

  const aiCompletionModel = process.env.AI_COMPLETION_MODEL;

  if (!aiCompletionModel) {
    throw new Error(
      'Missing required environment variable: AI_COMPLETION_MODEL',
    );
  }

  const appLocalization = process.env.APP_LOCALIZATION ?? 'ru';

  if (
    typeof appLocalization === 'string' &&
    appLocalization !== ('en' as const) &&
    appLocalization !== ('ru' as const)
  ) {
    throw new Error(
      'Invalid value for APP_LOCALIZATION. It must be either "en" or "ru".',
    );
  }

  return {
    openRouterApiKey,
    aiCompletionModel,
    appLocalization,
  } satisfies AppConfig;
}
