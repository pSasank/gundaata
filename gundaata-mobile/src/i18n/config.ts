/**
 * App Configuration
 *
 * Change these values to build different language/skin variants.
 * Each build of the app can target a specific language + skin combination.
 *
 * To create a Telugu variant:   language: 'te', skin: 'indian'
 * To create a Hindi variant:    language: 'hi', skin: 'indian'
 * To create an English variant: language: 'en', skin: 'default'
 */

import { LanguageCode, LanguageMeta } from './types';

/** The active language for this build */
export const APP_LANGUAGE: LanguageCode = 'te';

/** The active skin for this build */
export const APP_SKIN: string = 'indian';

/** Registry of all supported languages */
export const LANGUAGES: Record<LanguageCode, LanguageMeta> = {
  en: { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari' },
};

/** Maps skin IDs to language codes that use them */
export const SKIN_LANGUAGE_MAP: Record<string, LanguageCode[]> = {
  default: ['en'],
  indian: ['te', 'hi', 'kn', 'ta', 'mr'],
};
