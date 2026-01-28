/**
 * Game Store Hook Tests
 * Tests for Zustand store integration with game state
 * Using direct store access (no React required for Zustand)
 */

import { useGameStore } from '../../hooks/useGameStore';

// Helper to get current state
const getState = () => useGameStore.getState();

describe('useGameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    getState().resetStore();
  });

  describe('initial state', () => {
    test('starts with 1000 cash', () => {
      expect(getState().cash).toBe(1000);
    });

    test('starts with empty bets', () => {
      expect(getState().bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });

    test('starts with idle status', () => {
      expect(getState().status).toBe('idle');
    });

    test('starts with null dice', () => {
      expect(getState().dice).toBeNull();
    });
  });

  describe('placeBet', () => {
    test('places bet on dice number', () => {
      getState().placeBet(3, 100);
      expect(getState().bets[3]).toBe(100);
    });

    test('replaces existing bet', () => {
      getState().placeBet(3, 100);
      getState().placeBet(3, 200);
      expect(getState().bets[3]).toBe(200);
    });
  });

  describe('incrementBet', () => {
    test('increments bet by amount', () => {
      getState().incrementBet(3, 50);
      getState().incrementBet(3, 50);
      expect(getState().bets[3]).toBe(100);
    });

    test('caps at available cash', () => {
      getState().incrementBet(1, 600);
      getState().incrementBet(1, 600); // Would exceed 1000
      expect(getState().bets[1]).toBe(1000);
    });
  });

  describe('clearBets', () => {
    test('clears all bets', () => {
      getState().placeBet(1, 100);
      getState().placeBet(3, 200);
      getState().clearBets();
      expect(getState().bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });
  });

  describe('rollDice', () => {
    test('sets status to rolling and deducts bet', () => {
      getState().placeBet(3, 100);
      getState().rollDice();
      expect(getState().status).toBe('rolling');
      expect(getState().cash).toBe(900);
    });

    test('sets error if no bets placed', () => {
      getState().rollDice();
      expect(getState().status).toBe('idle');
      expect(getState().error).toBe('NO_BETS_PLACED');
    });
  });

  describe('setDiceResult', () => {
    test('updates dice and calculates winnings', () => {
      getState().placeBet(3, 100);
      getState().rollDice();
      getState().setDiceResult({ die1: 3, die2: 5 });

      expect(getState().dice).toEqual({ die1: 3, die2: 5 });
      expect(getState().cash).toBe(1100); // 900 + 200 winnings
      expect(getState().lastWin).toBe(200);
      expect(getState().status).toBe('idle');
    });

    test('triggers game over when cash is 0', () => {
      getState().placeBet(1, 1000);
      getState().rollDice();
      getState().setDiceResult({ die1: 3, die2: 5 }); // Loss

      expect(getState().cash).toBe(0);
      expect(getState().status).toBe('gameOver');
    });
  });

  describe('newGame', () => {
    test('resets game state', () => {
      getState().placeBet(1, 100);
      getState().rollDice();
      getState().setDiceResult({ die1: 3, die2: 5 });
      getState().newGame();

      expect(getState().cash).toBe(1000);
      expect(getState().bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
      expect(getState().status).toBe('idle');
      expect(getState().dice).toBeNull();
    });

    test('preserves high score', () => {
      // Win big
      getState().placeBet(3, 500);
      getState().rollDice();
      getState().setDiceResult({ die1: 3, die2: 3 }); // Double win = 2000

      const highScore = getState().highScore;

      getState().newGame();

      expect(getState().highScore).toBe(highScore);
    });
  });

  describe('addCash', () => {
    test('adds cash (for ad rewards)', () => {
      getState().addCash(500);
      expect(getState().cash).toBe(1500);
    });

    test('revives from game over', () => {
      // Lose all cash
      getState().placeBet(1, 1000);
      getState().rollDice();
      getState().setDiceResult({ die1: 3, die2: 5 });

      expect(getState().status).toBe('gameOver');

      getState().addCash(500);

      expect(getState().cash).toBe(500);
      expect(getState().status).toBe('idle');
    });
  });

  describe('computed values', () => {
    test('totalBet returns sum of all bets', () => {
      getState().placeBet(1, 100);
      getState().placeBet(3, 200);
      expect(getState().totalBet).toBe(300);
    });

    test('canRoll returns true when bets placed and idle', () => {
      expect(getState().canRoll).toBe(false);
      getState().placeBet(1, 100);
      expect(getState().canRoll).toBe(true);
    });

    test('canRoll returns false when rolling', () => {
      getState().placeBet(1, 100);
      getState().rollDice();
      expect(getState().canRoll).toBe(false);
    });
  });
});
