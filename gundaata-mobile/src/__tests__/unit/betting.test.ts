/**
 * Betting Module Tests
 * TDD: These tests are written BEFORE implementation
 */

import {
  validateBet,
  validateAllBets,
  calculateTotalBet,
  placeBet,
  clearBets,
  incrementBet,
  BetError,
  Bets,
} from '../../utils/betting';

describe('Betting Module', () => {

  describe('validateBet', () => {
    test('accepts valid bet within available cash', () => {
      const result = validateBet({ amount: 100, diceNumber: 3, availableCash: 1000 });
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('accepts bet of 0 (no bet on that number)', () => {
      const result = validateBet({ amount: 0, diceNumber: 1, availableCash: 1000 });
      expect(result.valid).toBe(true);
    });

    test('accepts bet equal to available cash', () => {
      const result = validateBet({ amount: 1000, diceNumber: 1, availableCash: 1000 });
      expect(result.valid).toBe(true);
    });

    test('rejects bet exceeding available cash', () => {
      const result = validateBet({ amount: 1001, diceNumber: 1, availableCash: 1000 });
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.EXCEEDS_CASH);
    });

    test('rejects negative bet amount', () => {
      const result = validateBet({ amount: -50, diceNumber: 1, availableCash: 1000 });
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.NEGATIVE_AMOUNT);
    });

    test('rejects non-integer bet amount', () => {
      const result = validateBet({ amount: 50.5, diceNumber: 1, availableCash: 1000 });
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.NOT_INTEGER);
    });

    test('rejects bet on invalid dice number (0)', () => {
      const result = validateBet({ amount: 50, diceNumber: 0, availableCash: 1000 });
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.INVALID_DICE_NUMBER);
    });

    test('rejects bet on invalid dice number (7)', () => {
      const result = validateBet({ amount: 50, diceNumber: 7, availableCash: 1000 });
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.INVALID_DICE_NUMBER);
    });

    test('rejects NaN amount', () => {
      const result = validateBet({ amount: NaN, diceNumber: 1, availableCash: 1000 });
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.INVALID_AMOUNT);
    });

    test('rejects Infinity amount', () => {
      const result = validateBet({ amount: Infinity, diceNumber: 1, availableCash: 1000 });
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.INVALID_AMOUNT);
    });
  });

  describe('validateAllBets', () => {
    test('accepts valid bets that sum to less than available cash', () => {
      const bets: Bets = { 1: 100, 2: 100, 3: 100, 4: 0, 5: 0, 6: 0 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(true);
    });

    test('accepts bets that exactly equal available cash', () => {
      const bets: Bets = { 1: 200, 2: 200, 3: 200, 4: 200, 5: 100, 6: 100 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(true);
    });

    test('rejects when total bets exceed available cash', () => {
      const bets: Bets = { 1: 500, 2: 500, 3: 100, 4: 0, 5: 0, 6: 0 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.TOTAL_EXCEEDS_CASH);
    });

    test('rejects if any individual bet is invalid (negative)', () => {
      const bets: Bets = { 1: -50, 2: 100, 3: 100, 4: 0, 5: 0, 6: 0 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(false);
      expect(result.invalidBets).toContain(1);
    });

    test('requires at least one non-zero bet', () => {
      const bets: Bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.NO_BETS_PLACED);
    });
  });

  describe('calculateTotalBet', () => {
    test('correctly sums all bets', () => {
      const bets: Bets = { 1: 100, 2: 50, 3: 25, 4: 75, 5: 0, 6: 150 };
      expect(calculateTotalBet(bets)).toBe(400);
    });

    test('returns 0 for all zero bets', () => {
      const bets: Bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      expect(calculateTotalBet(bets)).toBe(0);
    });

    test('handles single non-zero bet', () => {
      const bets: Bets = { 1: 500, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      expect(calculateTotalBet(bets)).toBe(500);
    });

    test('handles max bets on all numbers', () => {
      const bets: Bets = { 1: 1000, 2: 1000, 3: 1000, 4: 1000, 5: 1000, 6: 1000 };
      expect(calculateTotalBet(bets)).toBe(6000);
    });
  });

  describe('placeBet', () => {
    test('creates new bet entry', () => {
      const bets: Bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const newBets = placeBet(bets, 3, 100);
      expect(newBets[3]).toBe(100);
    });

    test('does not mutate original bets object', () => {
      const bets: Bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const newBets = placeBet(bets, 3, 100);
      expect(bets[3]).toBe(0);
      expect(newBets).not.toBe(bets);
    });

    test('replaces existing bet on same number', () => {
      const bets: Bets = { 1: 50, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const newBets = placeBet(bets, 1, 100);
      expect(newBets[1]).toBe(100);
    });

    test('preserves other bets when placing new bet', () => {
      const bets: Bets = { 1: 50, 2: 75, 3: 0, 4: 0, 5: 0, 6: 0 };
      const newBets = placeBet(bets, 3, 100);
      expect(newBets[1]).toBe(50);
      expect(newBets[2]).toBe(75);
      expect(newBets[3]).toBe(100);
    });
  });

  describe('incrementBet', () => {
    test('adds increment to existing bet', () => {
      const bets: Bets = { 1: 0, 2: 0, 3: 50, 4: 0, 5: 0, 6: 0 };
      const newBets = incrementBet(bets, 3, 100);
      expect(newBets[3]).toBe(150);
    });

    test('does not mutate original bets object', () => {
      const bets: Bets = { 1: 0, 2: 0, 3: 50, 4: 0, 5: 0, 6: 0 };
      incrementBet(bets, 3, 100);
      expect(bets[3]).toBe(50);
    });

    test('works on zero bet', () => {
      const bets: Bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const newBets = incrementBet(bets, 1, 50);
      expect(newBets[1]).toBe(50);
    });
  });

  describe('clearBets', () => {
    test('resets all bets to zero', () => {
      const bets: Bets = { 1: 100, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600 };
      const clearedBets = clearBets(bets);
      Object.values(clearedBets).forEach(bet => {
        expect(bet).toBe(0);
      });
    });

    test('does not mutate original bets object', () => {
      const bets: Bets = { 1: 100, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600 };
      clearBets(bets);
      expect(bets[1]).toBe(100);
    });

    test('returns object with all 6 dice numbers', () => {
      const bets: Bets = { 1: 100, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600 };
      const clearedBets = clearBets(bets);
      expect(Object.keys(clearedBets)).toHaveLength(6);
      expect(clearedBets).toHaveProperty('1');
      expect(clearedBets).toHaveProperty('6');
    });
  });

  describe('createEmptyBets', () => {
    // This helper creates initial empty bets object
    test('creates bets object with all zeros', () => {
      const { createEmptyBets } = require('../../utils/betting');
      const bets = createEmptyBets();
      expect(bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });
  });
});
