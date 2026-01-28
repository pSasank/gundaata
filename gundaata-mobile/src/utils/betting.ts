/**
 * Betting Module
 * TDD: Stub implementation - tests should fail initially
 */

import { isDiceValueValid } from './dice';

export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface Bets {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
}

export enum BetError {
  EXCEEDS_CASH = 'EXCEEDS_CASH',
  NEGATIVE_AMOUNT = 'NEGATIVE_AMOUNT',
  NOT_INTEGER = 'NOT_INTEGER',
  INVALID_DICE_NUMBER = 'INVALID_DICE_NUMBER',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  TOTAL_EXCEEDS_CASH = 'TOTAL_EXCEEDS_CASH',
  NO_BETS_PLACED = 'NO_BETS_PLACED',
  INCOMPLETE_BETS = 'INCOMPLETE_BETS',
}

export interface BetValidationResult {
  valid: boolean;
  error?: BetError;
  invalidBets?: number[];
}

export interface ValidateBetParams {
  amount: number;
  diceNumber: number;
  availableCash: number;
}

/**
 * Creates an empty bets object with all values set to 0
 */
export function createEmptyBets(): Bets {
  return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
}

/**
 * Validates a single bet
 */
export function validateBet(params: ValidateBetParams): BetValidationResult {
  const { amount, diceNumber, availableCash } = params;

  // Check for invalid amount (NaN, Infinity)
  if (!Number.isFinite(amount)) {
    return { valid: false, error: BetError.INVALID_AMOUNT };
  }

  // Check for negative amount
  if (amount < 0) {
    return { valid: false, error: BetError.NEGATIVE_AMOUNT };
  }

  // Check for non-integer
  if (!Number.isInteger(amount)) {
    return { valid: false, error: BetError.NOT_INTEGER };
  }

  // Check for invalid dice number
  if (!isDiceValueValid(diceNumber)) {
    return { valid: false, error: BetError.INVALID_DICE_NUMBER };
  }

  // Check if bet exceeds available cash
  if (amount > availableCash) {
    return { valid: false, error: BetError.EXCEEDS_CASH };
  }

  return { valid: true };
}

/**
 * Validates all bets against available cash
 */
export function validateAllBets(bets: Bets, availableCash: number): BetValidationResult {
  const invalidBets: number[] = [];

  // Check each individual bet
  for (let i = 1; i <= 6; i++) {
    const diceNumber = i as DiceNumber;
    const amount = bets[diceNumber];

    if (amount < 0 || !Number.isInteger(amount) || !Number.isFinite(amount)) {
      invalidBets.push(diceNumber);
    }
  }

  if (invalidBets.length > 0) {
    return { valid: false, invalidBets };
  }

  // Check total doesn't exceed cash
  const total = calculateTotalBet(bets);
  if (total > availableCash) {
    return { valid: false, error: BetError.TOTAL_EXCEEDS_CASH };
  }

  // Check at least one bet is placed
  if (total === 0) {
    return { valid: false, error: BetError.NO_BETS_PLACED };
  }

  return { valid: true };
}

/**
 * Calculates total bet amount across all dice numbers
 */
export function calculateTotalBet(bets: Bets): number {
  return bets[1] + bets[2] + bets[3] + bets[4] + bets[5] + bets[6];
}

/**
 * Places a bet on a specific dice number (immutable)
 */
export function placeBet(bets: Bets, diceNumber: DiceNumber, amount: number): Bets {
  return { ...bets, [diceNumber]: amount };
}

/**
 * Increments a bet on a specific dice number (immutable)
 */
export function incrementBet(bets: Bets, diceNumber: DiceNumber, increment: number): Bets {
  return { ...bets, [diceNumber]: bets[diceNumber] + increment };
}

/**
 * Clears all bets (immutable)
 */
export function clearBets(bets: Bets): Bets {
  return createEmptyBets();
}
