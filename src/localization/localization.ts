import { en } from '@/localization/en/en.js';
import { ru } from '@/localization/ru/ru.js';

import type {
  ILocalizationTypes,
  ILocalizationKey,
} from '@/localization/localizationTypes.js';

let lang: ILocalizationTypes = 'en';

export function setupLocalization(newLang: ILocalizationTypes) {
  lang = newLang;
}

export function $l(key: ILocalizationKey) {
  switch (lang) {
    case 'en':
      return en[key];
    case 'ru':
      return ru[key];
  }
}
