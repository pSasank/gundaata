/**
 * Winnings Calculation Tests
 * TDD: These tests are written BEFORE implementation
 */

import {
  calculateWinnings,
  calculatePayout,
  determineWinningNumbers,
  WinResult,
} from '../../utils/winnings';
import { Bets } from '../../utils/betting';
import { DiceRoll } from '../../utils/dice';

describe('Winnings Module', () => {
  const emptyBets: Bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  describe('determineWinningNumbers', () => {
    test('returns both numbers when dice are different', () => {
      const result = determineWinningNumbers({ die1: 3, die2: 5 });
      expect(result).toContain(3);
      expect(result).toContain(5);
      expect(result).toHaveLength(2);
    });

    test('returns single number when dice are same (doubles)', () => {
      const result = determineWinningNumbers({ die1: 4, die2: 4 });
      expect(result).toEqual([4]);
      expect(result).toHaveLength(1);
    });

    test('handles all dice values', () => {
      for (let i = 1; i <= 6; i++) {
        const result = determineWinningNumbers({ die1: i, die2: i });
        expect(result).toEqual([i]);
      }
    });
  });

  describe('calculatePayout', () => {
    test('returns 2x bet for single die match', () => {
      const payout = calculatePayout({ betAmount: 100, matchCount: 1 });
      expect(payout).toBe(200);
    });

    test('returns 4x bet for double match (both dice same number)', () => {
      const payout = calculatePayout({ betAmount: 100, matchCount: 2 });
      expect(payout).toBe(400);
    });

    test('returns 0 for no match', () => {
      const payout = calculatePayout({ betAmount: 100, matchCount: 0 });
      expect(payout).toBe(0);
    });

    test('handles zero bet amount', () => {
      const payout = calculatePayout({ betAmount: 0, matchCount: 1 });
      expect(payout).toBe(0);
    });

    test('handles large bet amounts', () => {
      const payout = calculatePayout({ betAmount: 10000, matchCount: 2 });
      expect(payout).toBe(40000);
    });
  });

  describe('calculateWinnings', () => {
    test('calculates correct winnings for single match', () => {
      const bets: Bets = { ...emptyBets, 3: 100 };
      const dice: DiceRoll = { die1: 3, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(200);
      expect(result.winningBets).toHaveLength(1);
      expect(result.winningBets[0]).toEqual({ number: 3, bet: 100, payout: 200 });
    });

    test('calculates correct winnings when both dice match different bets', () => {
      const bets: Bets = { ...emptyBets, 2: 100, 5: 50 };
      const dice: DiceRoll = { die1: 2, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(300); // 200 + 100
      expect(result.winningBets).toHaveLength(2);
    });

    test('calculates correct winnings for doubles (same number on both dice)', () => {
      const bets: Bets = { ...emptyBets, 4: 100 };
      const dice: DiceRoll = { die1: 4, die2: 4 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(400); // 4x for doubles
      expect(result.winningBets).toHaveLength(1);
      expect(result.winningBets[0]).toEqual({ number: 4, bet: 100, payout: 400 });
    });

    test('returns zero winnings when no dice match bets', () => {
      const bets: Bets = { ...emptyBets, 1: 100, 2: 100 };
      const dice: DiceRoll = { die1: 4, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(0);
      expect(result.winningBets).toHaveLength(0);
      expect(result.losingBets).toHaveLength(2);
    });

    test('correctly identifies partial wins (one bet wins, one loses)', () => {
      const bets: Bets = { ...emptyBets, 3: 100, 6: 50 };
      const dice: DiceRoll = { die1: 3, die2: 2 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(200);
      expect(result.winningBets).toHaveLength(1);
      expect(result.winningBets[0]).toEqual({ number: 3, bet: 100, payout: 200 });
      expect(result.losingBets).toHaveLength(1);
      expect(result.losingBets[0]).toEqual({ number: 6, bet: 50, payout: 0 });
    });

    test('calculates net result (winnings minus total bet)', () => {
      const bets: Bets = { ...emptyBets, 3: 100 };
      const dice: DiceRoll = { die1: 3, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalBet).toBe(100);
      expect(result.totalWinnings).toBe(200);
      expect(result.netResult).toBe(100); // Won 100 profit
    });

    test('calculates negative net result for loss', () => {
      const bets: Bets = { ...emptyBets, 1: 100 };
      const dice: DiceRoll = { die1: 3, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalBet).toBe(100);
      expect(result.totalWinnings).toBe(0);
      expect(result.netResult).toBe(-100); // Lost 100
    });

    test('handles bets on all numbers', () => {
      const bets: Bets = { 1: 10, 2: 20, 3: 30, 4: 40, 5: 50, 6: 60 };
      const dice: DiceRoll = { die1: 3, die2: 5 };
      const result = calculateWinnings(bets, dice);

      // 30*2 + 50*2 = 160
      expect(result.totalWinnings).toBe(160);
      expect(result.totalBet).toBe(210);
      expect(result.winningBets).toHaveLength(2);
      expect(result.losingBets).toHaveLength(4);
    });

    test('handles max bets scenario', () => {
      const bets: Bets = { 1: 1000, 2: 1000, 3: 1000, 4: 1000, 5: 1000, 6: 1000 };
      const dice: DiceRoll = { die1: 1, die2: 6 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(4000); // 2000 + 2000
      expect(result.totalBet).toBe(6000);
      expect(result.netResult).toBe(-2000); // Net loss
    });

    test('result includes dice roll', () => {
      const bets: Bets = { ...emptyBets, 1: 100 };
      const dice: DiceRoll = { die1: 1, die2: 2 };
      const result = calculateWinnings(bets, dice);

      expect(result.dice).toEqual(dice);
    });

    test('handles zero bets (edge case)', () => {
      const bets: Bets = { ...emptyBets };
      const dice: DiceRoll = { die1: 3, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(0);
      expect(result.totalBet).toBe(0);
      expect(result.netResult).toBe(0);
      expect(result.winningBets).toHaveLength(0);
      expect(result.losingBets).toHaveLength(0);
    });
  });

  describe('WinResult properties', () => {
    test('result includes all required properties', () => {
      const bets: Bets = { ...emptyBets, 1: 100 };
      const dice: DiceRoll = { die1: 1, die2: 2 };
      const result = calculateWinnings(bets, dice);

      expect(result).toHaveProperty('totalBet');
      expect(result).toHaveProperty('totalWinnings');
      expect(result).toHaveProperty('netResult');
      expect(result).toHaveProperty('winningBets');
      expect(result).toHaveProperty('losingBets');
      expect(result).toHaveProperty('dice');
    });
  });
});
