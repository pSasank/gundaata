/**
 * Marathi translations
 * मराठी भाषांतर
 */

import { Translations } from '../types';

export const mr: Translations = {
  // App
  appTitle: 'गुंडाटा',

  // Game Screen header
  cashLabel: 'रोख',
  highScoreLabel: 'सर्वोच्च गुण',

  // Chip Selector instructions
  rollingInstruction: 'फासे टाकत आहोत...',
  totalBetInstruction: 'एकूण पैज: {totalBet} — आणखी जोडण्यासाठी अंकांवर टॅप करा',
  placeBetInstruction: '{chipValue} पैज लावण्यासाठी बोर्डावरील अंकावर टॅप करा',

  // Chip Selector buttons
  clearButton: 'पुसा',
  rollingButton: 'टाकत आहोत...',
  rollDiceButton: 'फासे टाका',

  // Dice Area
  winAmount: '+{amount}',
  noLuck: 'नशीब नाही',
  rollingText: 'टाकत आहोत...',

  // Game Over Modal
  gameOver: 'खेळ संपला',
  newHighScore: 'नवीन सर्वोच्च गुण!',
  highScoreModalLabel: 'सर्वोच्च गुण',
  watchAdButton: '{amount} साठी जाहिरात पहा',
  adNotAvailable: 'जाहिरात उपलब्ध नाही',
  newGameButton: 'नवीन खेळ',

  // Accessibility labels
  selectChipA11y: '{value} चिप निवडा',
  clearBetsA11y: 'सर्व पैज पुसा',
  diceRollingA11y: 'फासे लोळत आहेत',
  rollDiceA11y: 'फासे टाका',
  betCellA11y: 'अंक {number}, पैज {bet}',
  diceShowingA11y: 'फासा {value} दाखवत आहे',
  diceA11y: 'फासा',
  watchAdA11y: 'सुरू ठेवण्यासाठी जाहिरात पहा',
  newGameA11y: 'नवीन खेळ सुरू करा',
};
