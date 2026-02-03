/**
 * Telugu translations (primary language)
 * తెలుగు అనువాదాలు
 */

import { Translations } from '../types';

export const te: Translations = {
  // App
  appTitle: 'గుండాట',

  // Game Screen header
  cashLabel: 'నగదు',
  highScoreLabel: 'అత్యధిక స్కోరు',

  // Chip Selector instructions
  rollingInstruction: 'పాచికలు వేస్తున్నాము...',
  totalBetInstruction: 'మొత్తం పందెం: {totalBet} — మరిన్ని జోడించడానికి సంఖ్యలపై నొక్కండి',
  placeBetInstruction: '{chipValue} పందెం వేయడానికి బోర్డుపై సంఖ్యను నొక్కండి',

  // Chip Selector buttons
  clearButton: 'తొలగించు',
  rollingButton: 'వేస్తున్నాము...',
  rollDiceButton: 'పాచికలు వేయి',

  // Dice Area
  winAmount: '+{amount}',
  noLuck: 'అదృష్టం లేదు',
  rollingText: 'వేస్తున్నాము...',

  // Game Over Modal
  gameOver: 'ఆట అయిపోయింది',
  newHighScore: 'కొత్త అత్యధిక స్కోరు!',
  highScoreModalLabel: 'అత్యధిక స్కోరు',
  watchAdButton: '{amount} కోసం ప్రకటన చూడండి',
  adNotAvailable: 'ప్రకటన అందుబాటులో లేదు',
  newGameButton: 'కొత్త ఆట',

  // Accessibility labels
  selectChipA11y: '{value} చిప్ ఎంచుకోండి',
  clearBetsA11y: 'అన్ని పందాలు తొలగించు',
  diceRollingA11y: 'పాచికలు దొర్లుతున్నాయి',
  rollDiceA11y: 'పాచికలు వేయండి',
  betCellA11y: 'సంఖ్య {number}, పందెం {bet}',
  diceShowingA11y: 'పాచిక {value} చూపిస్తోంది',
  diceA11y: 'పాచిక',
  watchAdA11y: 'కొనసాగించడానికి ప్రకటన చూడండి',
  newGameA11y: 'కొత్త ఆట ప్రారంభించు',
};
