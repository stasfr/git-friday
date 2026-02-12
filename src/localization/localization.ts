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
    lang = config.appLocalization;
  } catch (error) {
    console.log(
      'Failed to get application config, used English language as default',
    );
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
