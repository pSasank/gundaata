/**
 * Kannada translations
 * ಕನ್ನಡ ಅನುವಾದಗಳು
 */

import { Translations } from '../types';

export const kn: Translations = {
  // App
  appTitle: 'ಗುಂಡಾಟ',

  // Game Screen header
  cashLabel: 'ನಗದು',
  highScoreLabel: 'ಅತ್ಯಧಿಕ ಸ್ಕೋರ್',

  // Chip Selector instructions
  rollingInstruction: 'ದಾಳ ಹಾಕುತ್ತಿದ್ದೇವೆ...',
  totalBetInstruction: 'ಒಟ್ಟು ಪಂದ್ಯ: {totalBet} — ಹೆಚ್ಚು ಸೇರಿಸಲು ಸಂಖ್ಯೆಗಳನ್ನು ಒತ್ತಿ',
  placeBetInstruction: '{chipValue} ಪಂದ್ಯ ಕಟ್ಟಲು ಬೋರ್ಡ್‌ನಲ್ಲಿ ಸಂಖ್ಯೆ ಒತ್ತಿ',

  // Chip Selector buttons
  clearButton: 'ತೆರವುಗೊಳಿಸು',
  rollingButton: 'ಹಾಕುತ್ತಿದ್ದೇವೆ...',
  rollDiceButton: 'ದಾಳ ಹಾಕಿ',

  // Dice Area
  winAmount: '+{amount}',
  noLuck: 'ಅದೃಷ್ಟವಿಲ್ಲ',
  rollingText: 'ಹಾಕುತ್ತಿದ್ದೇವೆ...',

  // Game Over Modal
  gameOver: 'ಆಟ ಮುಗಿಯಿತು',
  newHighScore: 'ಹೊಸ ಅತ್ಯಧಿಕ ಸ್ಕೋರ್!',
  highScoreModalLabel: 'ಅತ್ಯಧಿಕ ಸ್ಕೋರ್',
  watchAdButton: '{amount} ಗಾಗಿ ಜಾಹೀರಾತು ನೋಡಿ',
  adNotAvailable: 'ಜಾಹೀರಾತು ಲಭ್ಯವಿಲ್ಲ',
  newGameButton: 'ಹೊಸ ಆಟ',

  // Accessibility labels
  selectChipA11y: '{value} ಚಿಪ್ ಆಯ್ಕೆಮಾಡಿ',
  clearBetsA11y: 'ಎಲ್ಲಾ ಪಂದ್ಯಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ',
  diceRollingA11y: 'ದಾಳ ಉರುಳುತ್ತಿದೆ',
  rollDiceA11y: 'ದಾಳ ಹಾಕಿ',
  betCellA11y: 'ಸಂಖ್ಯೆ {number}, ಪಂದ್ಯ {bet}',
  diceShowingA11y: 'ದಾಳ {value} ತೋರಿಸುತ್ತಿದೆ',
  diceA11y: 'ದಾಳ',
  watchAdA11y: 'ಮುಂದುವರಿಸಲು ಜಾಹೀರಾತು ನೋಡಿ',
  newGameA11y: 'ಹೊಸ ಆಟ ಪ್ರಾರಂಭಿಸಿ',
};
