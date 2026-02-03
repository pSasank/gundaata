/**
 * i18n Service
 * Provides translation and currency formatting based on configurable language/skin.
 *
 * Usage:
 *   import { t, formatCurrency } from '../i18n';
 *   t('rollDiceButton')             // => 'పాచికలు వేయి' (Telugu)
 *   t('winAmount', { amount: '₹500' }) // => '+₹500'
 *   formatCurrency(500)             // => '₹500' (Indian skin)
 */

import { Translations, TranslationKey, LanguageCode } from './types';
import { AppSkin } from './skins/types';
import { APP_LANGUAGE, SKIN_LANGUAGE_MAP } from './config';

// Language modules
import { en } from './languages/en';
import { te } from './languages/te';
import { hi } from './languages/hi';
import { kn } from './languages/kn';
import { ta } from './languages/ta';
import { mr } from './languages/mr';

// Skin modules
import { defaultSkin } from './skins/default';
import { indianSkin } from './skins/indian';

/** All loaded language packs */
const LANGUAGE_PACKS: Record<LanguageCode, Translations> = {
  en,
  te,
  hi,
  kn,
  ta,
  mr,
};

/** All loaded skins */
const SKINS: Record<string, AppSkin> = {
  default: defaultSkin,
  indian: indianSkin,
};

/** Current active language */
let currentLanguage: LanguageCode = APP_LANGUAGE;

/**
 * Set the active language.
 */
export function setLanguage(lang: LanguageCode): void {
  currentLanguage = lang;
}

/**
 * Get the current active language code.
 */
export function getLanguage(): LanguageCode {
  return currentLanguage;
}

/**
 * Get the skin associated with the current language.
 */
export function getSkin(): AppSkin {
  for (const [skinId, langs] of Object.entries(SKIN_LANGUAGE_MAP)) {
    if ((langs as LanguageCode[]).includes(currentLanguage)) {
      return SKINS[skinId] || defaultSkin;
    }
  }
  return defaultSkin;
}

/**
 * Translate a key, optionally interpolating parameters.
 *
 * @param key - Translation key from the Translations interface
 * @param params - Optional object with interpolation values, e.g. { amount: '$500' }
 * @returns Translated string with parameters substituted
 */
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const pack = LANGUAGE_PACKS[currentLanguage] || LANGUAGE_PACKS.en;
  let value = pack[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
    });
  }

  return value;
}

/**
 * Format a number as currency using the current skin's symbol.
 *
 * @param amount - Numeric amount
 * @returns Formatted string, e.g. '$1,000' or '₹1,000'
 */
export function formatCurrency(amount: number): string {
  const skin = getSkin();
  const formatted = amount.toLocaleString();
  if (skin.currencyPosition === 'before') {
    return `${skin.currencySymbol}${formatted}`;
  }
  return `${formatted}${skin.currencySymbol}`;
}

// Re-export types for convenience
export type { Translations, TranslationKey, LanguageCode } from './types';
export type { AppSkin } from './skins/types';
