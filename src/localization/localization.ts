import { ConfigService } from '@/cli/config/configService.js';

import { en } from '@/localization/en/en.js';
import { ru } from '@/localization/ru/ru.js';

import type {
  ILocalizationTypes,
  ILocalizationKey,
} from '@/localization/localizationTypes.js';

let lang: ILocalizationTypes = 'en';

export async function setupLocalization() {
  const configService = new ConfigService();
  try {
    await configService.checkIfConfigExists();
    const config = await configService.getAppConfig();
    if (!config.appLocalization) {
      throw new Error('Localization not configured');
    }
    lang = config.appLocalization;
  } catch (error) {
    console.log($l('failedToGetConfigForLocalization'));
    if (error instanceof Error) {
      console.log('Cause:', error.message);
    }
    console.log();
  }
}

export function $l(key: ILocalizationKey) {
  switch (lang) {
    case 'en':
      return en[key];
    case 'ru':
      return ru[key];
  }
}
