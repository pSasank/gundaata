/**
 * i18n Service Tests
 * TDD: Tests written first for the internationalization system.
 */

import { en } from '../../i18n/languages/en';
import { te } from '../../i18n/languages/te';
import { hi } from '../../i18n/languages/hi';
import { kn } from '../../i18n/languages/kn';
import { ta } from '../../i18n/languages/ta';
import { mr } from '../../i18n/languages/mr';
import { Translations, TranslationKey, LanguageCode } from '../../i18n/types';
import {
  t,
  setLanguage,
  getLanguage,
  formatCurrency,
  getSkin,
} from '../../i18n';

// All language modules for completeness testing
const ALL_LANGUAGES: Record<string, Translations> = { en, te, hi, kn, ta, mr };
const ALL_LANGUAGE_CODES: LanguageCode[] = ['en', 'te', 'hi', 'kn', 'ta', 'mr'];

// Get all keys from the English reference
const EXPECTED_KEYS = Object.keys(en) as TranslationKey[];

describe('i18n', () => {
  // Reset to default before each test
  beforeEach(() => {
    setLanguage('te');
  });

  describe('Language file completeness', () => {
    test.each(ALL_LANGUAGE_CODES)(
      '%s has all required translation keys',
      (langCode) => {
        const lang = ALL_LANGUAGES[langCode];
        const langKeys = Object.keys(lang);
        EXPECTED_KEYS.forEach(key => {
          expect(langKeys).toContain(key);
          expect(typeof lang[key]).toBe('string');
          expect(lang[key].length).toBeGreaterThan(0);
        });
      }
    );

    test.each(ALL_LANGUAGE_CODES)(
      '%s has no extra keys beyond the Translations interface',
      (langCode) => {
        const lang = ALL_LANGUAGES[langCode];
        const langKeys = Object.keys(lang);
        langKeys.forEach(key => {
          expect(EXPECTED_KEYS).toContain(key);
        });
      }
    );

    test('all languages have the same number of keys', () => {
      const expectedCount = EXPECTED_KEYS.length;
      ALL_LANGUAGE_CODES.forEach(code => {
        expect(Object.keys(ALL_LANGUAGES[code])).toHaveLength(expectedCount);
      });
    });
  });

  describe('t() function', () => {
    test('returns Telugu string by default', () => {
      setLanguage('te');
      expect(t('appTitle')).toBe('గుండాట');
    });

    test('returns English string when language is en', () => {
      setLanguage('en');
      expect(t('appTitle')).toBe('GUNDAATA');
    });

    test('returns Hindi string when language is hi', () => {
      setLanguage('hi');
      expect(t('appTitle')).toBe('गुंडाटा');
    });

    test('returns Kannada string when language is kn', () => {
      setLanguage('kn');
      expect(t('appTitle')).toBe('ಗುಂಡಾಟ');
    });

    test('returns Tamil string when language is ta', () => {
      setLanguage('ta');
      expect(t('appTitle')).toBe('குண்டாட்டா');
    });

    test('returns Marathi string when language is mr', () => {
      setLanguage('mr');
      expect(t('appTitle')).toBe('गुंडाटा');
    });

    test('returns translated game labels', () => {
      setLanguage('te');
      expect(t('cashLabel')).toBe('నగదు');
      expect(t('highScoreLabel')).toBe('అత్యధిక స్కోరు');
      expect(t('gameOver')).toBe('ఆట అయిపోయింది');
      expect(t('noLuck')).toBe('అదృష్టం లేదు');
    });

    test('returns translated button labels', () => {
      setLanguage('te');
      expect(t('rollDiceButton')).toBe('పాచికలు వేయి');
      expect(t('clearButton')).toBe('తొలగించు');
      expect(t('newGameButton')).toBe('కొత్త ఆట');
    });
  });

  describe('t() with interpolation', () => {
    test('interpolates single parameter', () => {
      setLanguage('en');
      expect(t('winAmount', { amount: '$500' })).toBe('+$500');
    });

    test('interpolates multiple parameters', () => {
      setLanguage('en');
      expect(t('betCellA11y', { number: '3', bet: '100' })).toBe('Number 3, bet 100');
    });

    test('interpolates totalBet in instruction', () => {
      setLanguage('en');
      const result = t('totalBetInstruction', { totalBet: '$1,000' });
      expect(result).toBe('Total bet: $1,000 — tap numbers to add more');
    });

    test('interpolates chipValue in instruction', () => {
      setLanguage('en');
      const result = t('placeBetInstruction', { chipValue: '$50' });
      expect(result).toBe('Tap a number on the board to bet $50');
    });

    test('interpolates in Telugu', () => {
      setLanguage('te');
      const result = t('placeBetInstruction', { chipValue: '₹50' });
      expect(result).toBe('₹50 పందెం వేయడానికి బోర్డుపై సంఖ్యను నొక్కండి');
    });

    test('interpolates watchAd button amount', () => {
      setLanguage('en');
      expect(t('watchAdButton', { amount: '$500' })).toBe('Watch Ad for $500');
    });

    test('leaves unmatched placeholders as-is', () => {
      setLanguage('en');
      // If no params provided for a string with placeholders
      expect(t('winAmount')).toBe('+{amount}');
    });

    test('ignores extra parameters', () => {
      setLanguage('en');
      expect(t('noLuck', { foo: 'bar' })).toBe('No luck');
    });
  });

  describe('setLanguage() / getLanguage()', () => {
    test('getLanguage returns current language', () => {
      setLanguage('te');
      expect(getLanguage()).toBe('te');
    });

    test('setLanguage changes the active language', () => {
      setLanguage('en');
      expect(getLanguage()).toBe('en');
      expect(t('appTitle')).toBe('GUNDAATA');

      setLanguage('hi');
      expect(getLanguage()).toBe('hi');
      expect(t('appTitle')).toBe('गुंडाटा');
    });

    test('setLanguage to all supported languages works', () => {
      ALL_LANGUAGE_CODES.forEach(code => {
        setLanguage(code);
        expect(getLanguage()).toBe(code);
        expect(t('appTitle')).toBeTruthy();
      });
    });
  });

  describe('formatCurrency()', () => {
    test('formats with dollar sign (default skin)', () => {
      setLanguage('en');
      expect(formatCurrency(500)).toBe('$500');
    });

    test('formats with rupee sign (indian skin)', () => {
      setLanguage('te');
      expect(formatCurrency(500)).toBe('₹500');
    });

    test('formats large numbers with locale separators', () => {
      setLanguage('en');
      expect(formatCurrency(1000)).toBe('$1,000');
    });

    test('formats zero', () => {
      setLanguage('en');
      expect(formatCurrency(0)).toBe('$0');
    });

    test('Hindi uses rupee', () => {
      setLanguage('hi');
      expect(formatCurrency(100)).toBe('₹100');
    });

    test('Kannada uses rupee', () => {
      setLanguage('kn');
      expect(formatCurrency(100)).toBe('₹100');
    });
  });

  describe('getSkin()', () => {
    test('returns default skin for English', () => {
      setLanguage('en');
      const skin = getSkin();
      expect(skin.id).toBe('default');
      expect(skin.currencySymbol).toBe('$');
    });

    test('returns indian skin for Telugu', () => {
      setLanguage('te');
      const skin = getSkin();
      expect(skin.id).toBe('indian');
      expect(skin.currencySymbol).toBe('₹');
    });

    test('returns indian skin for Hindi', () => {
      setLanguage('hi');
      const skin = getSkin();
      expect(skin.id).toBe('indian');
    });

    test('returns indian skin for all Indian languages', () => {
      const indianLangs: LanguageCode[] = ['te', 'hi', 'kn', 'ta', 'mr'];
      indianLangs.forEach(code => {
        setLanguage(code);
        expect(getSkin().id).toBe('indian');
      });
    });

    test('skin has celebration decorators', () => {
      setLanguage('te');
      const skin = getSkin();
      expect(skin.celebrationPrefix).toBeDefined();
      expect(skin.celebrationSuffix).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    test('all non-English languages have different appTitle from English', () => {
      const nonEnglish: LanguageCode[] = ['te', 'hi', 'kn', 'ta', 'mr'];
      nonEnglish.forEach(code => {
        expect(ALL_LANGUAGES[code].appTitle).not.toBe(en.appTitle);
      });
    });

    test('no translation value is empty string', () => {
      ALL_LANGUAGE_CODES.forEach(code => {
        const lang = ALL_LANGUAGES[code];
        EXPECTED_KEYS.forEach(key => {
          expect(lang[key]).not.toBe('');
        });
      });
    });

    test('interpolation placeholders in all languages use same param names', () => {
      // Check that strings with {totalBet} in English also have {totalBet} in other languages
      const keysWithParams: TranslationKey[] = [
        'totalBetInstruction',
        'placeBetInstruction',
        'winAmount',
        'watchAdButton',
        'selectChipA11y',
        'betCellA11y',
        'diceShowingA11y',
      ];

      keysWithParams.forEach(key => {
        const enParams = (en[key].match(/\{(\w+)\}/g) || []).sort();
        ALL_LANGUAGE_CODES.forEach(code => {
          const langParams = (ALL_LANGUAGES[code][key].match(/\{(\w+)\}/g) || []).sort();
          expect(langParams).toEqual(enParams);
        });
      });
    });
  });
});
