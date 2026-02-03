/**
 * Hindi translations
 * हिन्दी अनुवाद
 */

import { Translations } from '../types';

export const hi: Translations = {
  // App
  appTitle: 'गुंडाटा',

  // Game Screen header
  cashLabel: 'नकद',
  highScoreLabel: 'उच्चतम स्कोर',

  // Chip Selector instructions
  rollingInstruction: 'पासा फेंक रहे हैं...',
  totalBetInstruction: 'कुल दांव: {totalBet} — और जोड़ने के लिए नंबर दबाएं',
  placeBetInstruction: '{chipValue} का दांव लगाने के लिए बोर्ड पर नंबर दबाएं',

  // Chip Selector buttons
  clearButton: 'मिटाएं',
  rollingButton: 'फेंक रहे हैं...',
  rollDiceButton: 'पासा फेंको',

  // Dice Area
  winAmount: '+{amount}',
  noLuck: 'किस्मत नहीं',
  rollingText: 'फेंक रहे हैं...',

  // Game Over Modal
  gameOver: 'खेल खत्म',
  newHighScore: 'नया उच्चतम स्कोर!',
  highScoreModalLabel: 'उच्चतम स्कोर',
  watchAdButton: '{amount} के लिए विज्ञापन देखें',
  adNotAvailable: 'विज्ञापन उपलब्ध नहीं',
  newGameButton: 'नया खेल',

  // Accessibility labels
  selectChipA11y: '{value} चिप चुनें',
  clearBetsA11y: 'सभी दांव मिटाएं',
  diceRollingA11y: 'पासा लुढ़क रहा है',
  rollDiceA11y: 'पासा फेंको',
  betCellA11y: 'नंबर {number}, दांव {bet}',
  diceShowingA11y: 'पासा {value} दिखा रहा है',
  diceA11y: 'पासा',
  watchAdA11y: 'जारी रखने के लिए विज्ञापन देखें',
  newGameA11y: 'नया खेल शुरू करें',
};
