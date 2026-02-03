/**
 * i18n Type Definitions
 * All translatable string keys used across the app.
 * Every language file must implement this interface completely.
 */

export interface Translations {
  // App
  appTitle: string;

  // Game Screen header
  cashLabel: string;
  highScoreLabel: string;

  // Chip Selector instructions
  rollingInstruction: string;
  totalBetInstruction: string;   // interpolation: {totalBet}
  placeBetInstruction: string;   // interpolation: {chipValue}

  // Chip Selector buttons
  clearButton: string;
  rollingButton: string;
  rollDiceButton: string;

  // Dice Area
  winAmount: string;     // interpolation: {amount}
  noLuck: string;
  rollingText: string;

  // Game Over Modal
  gameOver: string;
  newHighScore: string;
  highScoreModalLabel: string;
  watchAdButton: string;       // interpolation: {amount}
  adNotAvailable: string;
  newGameButton: string;

  // Accessibility labels
  selectChipA11y: string;      // interpolation: {value}
  clearBetsA11y: string;
  diceRollingA11y: string;
  rollDiceA11y: string;
  betCellA11y: string;         // interpolation: {number}, {bet}
  diceShowingA11y: string;     // interpolation: {value}
  diceA11y: string;
  watchAdA11y: string;
  newGameA11y: string;
}

export type TranslationKey = keyof Translations;

export type LanguageCode = 'en' | 'te' | 'hi' | 'kn' | 'ta' | 'mr';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;           // English name
  nativeName: string;     // Name in own script
  script: string;         // Script system (Latin, Telugu, Devanagari, etc.)
}
