import { errors } from './errors.js';
import { messages } from './messages.js';

import type { ILocalizationList } from '@/localization/localization.types.js';

export const ru = {
  ...errors,
  ...messages,
} satisfies ILocalizationList;
