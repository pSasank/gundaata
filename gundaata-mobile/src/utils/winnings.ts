/**
 * Winnings Module
 * TDD: Stub implementation - tests should fail initially
 */

import { Bets, DiceNumber, calculateTotalBet } from './betting';
import { DiceRoll } from './dice';

export interface BetResult {
  number: number;
  bet: number;
  payout: number;
}

export interface WinResult {
  totalBet: number;
  totalWinnings: number;
  netResult: number;
  winningBets: BetResult[];
  losingBets: BetResult[];
  dice: DiceRoll;
}

export interface PayoutParams {
  betAmount: number;
  matchCount: number;
}

/**
 * Determines which numbers are winning based on dice roll
 */
export function determineWinningNumbers(dice: DiceRoll): number[] {
  if (dice.die1 === dice.die2) {
    return [dice.die1];
  }
  return [dice.die1, dice.die2];
}

/**
 * Calculates payout for a single bet
 * - 2x for single die match
 * - 4x for both dice matching (doubles)
 */
export function calculatePayout(params: PayoutParams): number {
  const { betAmount, matchCount } = params;
  if (matchCount === 0) return 0;
  if (matchCount === 1) return betAmount * 2;
  if (matchCount === 2) return betAmount * 4; // Doubles bonus
  return 0;
}

/**
 * Calculates all winnings from bets and dice roll
 */
export function calculateWinnings(bets: Bets, dice: DiceRoll): WinResult {
  const winningNumbers = determineWinningNumbers(dice);
  const winningBets: BetResult[] = [];
  const losingBets: BetResult[] = [];

  // Check each bet
  for (let i = 1; i <= 6; i++) {
    const diceNumber = i as DiceNumber;
    const betAmount = bets[diceNumber];

    // Skip if no bet on this number
    if (betAmount === 0) continue;

    // Count how many dice match this number
    let matchCount = 0;
    if (dice.die1 === diceNumber) matchCount++;
    if (dice.die2 === diceNumber) matchCount++;

    const payout = calculatePayout({ betAmount, matchCount });

    if (payout > 0) {
      winningBets.push({ number: diceNumber, bet: betAmount, payout });
    } else {
      losingBets.push({ number: diceNumber, bet: betAmount, payout: 0 });
    }
  }

  const totalBet = calculateTotalBet(bets);
  const totalWinnings = winningBets.reduce((sum, b) => sum + b.payout, 0);
  const netResult = totalWinnings - totalBet;

  return {
    totalBet,
    totalWinnings,
    netResult,
    winningBets,
    losingBets,
    dice,
  };
}
