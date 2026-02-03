/**
 * English translations (secondary language)
 */

import { Translations } from '../types';

export const en: Translations = {
  // App
  appTitle: 'GUNDAATA',

  // Game Screen header
  cashLabel: 'CASH',
  highScoreLabel: 'HIGH SCORE',

  // Chip Selector instructions
  rollingInstruction: 'Rolling the dice...',
  totalBetInstruction: 'Total bet: {totalBet} — tap numbers to add more',
  placeBetInstruction: 'Tap a number on the board to bet {chipValue}',

  // Chip Selector buttons
  clearButton: 'Clear',
  rollingButton: 'ROLLING...',
  rollDiceButton: 'ROLL DICE',

  // Dice Area
  winAmount: '+{amount}',
  noLuck: 'No luck',
  rollingText: 'Rolling...',

  // Game Over Modal
  gameOver: 'Game Over',
  newHighScore: 'New High Score!',
  highScoreModalLabel: 'High Score',
  watchAdButton: 'Watch Ad for {amount}',
  adNotAvailable: 'Ad Not Available',
  newGameButton: 'New Game',

  // Accessibility labels
  selectChipA11y: 'Select {value} chip',
  clearBetsA11y: 'Clear all bets',
  diceRollingA11y: 'Dice rolling',
  rollDiceA11y: 'Roll the dice',
  betCellA11y: 'Number {number}, bet {bet}',
  diceShowingA11y: 'Dice showing {value}',
  diceA11y: 'Dice',
  watchAdA11y: 'Watch advertisement to continue',
  newGameA11y: 'Start new game',
};
