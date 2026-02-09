import { errors } from './errors.js';
import { messages } from './messages.js';

import type { ILocalizationList } from '@/localization/localization.types.js';

export const en = {
  ...errors,
  ...messages,
} satisfies ILocalizationList;
