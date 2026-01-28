/**
 * Game Store Hook Tests
 * Tests for Zustand store integration with game state
 */

import { act, renderHook } from '@testing-library/react-native';
import { useGameStore } from '../../hooks/useGameStore';

describe('useGameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().resetStore();
  });

  describe('initial state', () => {
    test('starts with 1000 cash', () => {
      const { result } = renderHook(() => useGameStore());
      expect(result.current.cash).toBe(1000);
    });

    test('starts with empty bets', () => {
      const { result } = renderHook(() => useGameStore());
      expect(result.current.bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });

    test('starts with idle status', () => {
      const { result } = renderHook(() => useGameStore());
      expect(result.current.status).toBe('idle');
    });

    test('starts with null dice', () => {
      const { result } = renderHook(() => useGameStore());
      expect(result.current.dice).toBeNull();
    });
  });

  describe('placeBet', () => {
    test('places bet on dice number', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.placeBet(3, 100);
      });

      expect(result.current.bets[3]).toBe(100);
    });

    test('replaces existing bet', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.placeBet(3, 100);
        result.current.placeBet(3, 200);
      });

      expect(result.current.bets[3]).toBe(200);
    });
  });

  describe('incrementBet', () => {
    test('increments bet by amount', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.incrementBet(3, 50);
        result.current.incrementBet(3, 50);
      });

      expect(result.current.bets[3]).toBe(100);
    });

    test('caps at available cash', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.incrementBet(1, 600);
        result.current.incrementBet(1, 600); // Would exceed 1000
      });

      expect(result.current.bets[1]).toBe(1000);
    });
  });

  describe('clearBets', () => {
    test('clears all bets', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.placeBet(1, 100);
        result.current.placeBet(3, 200);
        result.current.clearBets();
      });

      expect(result.current.bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });
  });

  describe('rollDice', () => {
    test('sets status to rolling and deducts bet', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.placeBet(3, 100);
        result.current.rollDice();
      });

      expect(result.current.status).toBe('rolling');
      expect(result.current.cash).toBe(900);
    });

    test('sets error if no bets placed', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.rollDice();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.error).toBe('NO_BETS_PLACED');
    });
  });

  describe('setDiceResult', () => {
    test('updates dice and calculates winnings', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.placeBet(3, 100);
        result.current.rollDice();
        result.current.setDiceResult({ die1: 3, die2: 5 });
      });

      expect(result.current.dice).toEqual({ die1: 3, die2: 5 });
      expect(result.current.cash).toBe(1100); // 900 + 200 winnings
      expect(result.current.lastWin).toBe(200);
      expect(result.current.status).toBe('idle');
    });

    test('triggers game over when cash is 0', () => {
      const { result } = renderHook(() => useGameStore());

      // Set low cash scenario
      act(() => {
        result.current.placeBet(1, 1000);
        result.current.rollDice();
        result.current.setDiceResult({ die1: 3, die2: 5 }); // Loss
      });

      expect(result.current.cash).toBe(0);
      expect(result.current.status).toBe('gameOver');
    });
  });

  describe('newGame', () => {
    test('resets game state', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.placeBet(1, 100);
        result.current.rollDice();
        result.current.setDiceResult({ die1: 3, die2: 5 });
        result.current.newGame();
      });

      expect(result.current.cash).toBe(1000);
      expect(result.current.bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
      expect(result.current.status).toBe('idle');
      expect(result.current.dice).toBeNull();
    });

    test('preserves high score', () => {
      const { result } = renderHook(() => useGameStore());

      // Win big then lose
      act(() => {
        result.current.placeBet(3, 500);
        result.current.rollDice();
        result.current.setDiceResult({ die1: 3, die2: 3 }); // Double win = 2000
      });

      const highScore = result.current.highScore;

      act(() => {
        result.current.newGame();
      });

      expect(result.current.highScore).toBe(highScore);
    });
  });

  describe('addCash', () => {
    test('adds cash (for ad rewards)', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.addCash(500);
      });

      expect(result.current.cash).toBe(1500);
    });

    test('revives from game over', () => {
      const { result } = renderHook(() => useGameStore());

      // Lose all cash
      act(() => {
        result.current.placeBet(1, 1000);
        result.current.rollDice();
        result.current.setDiceResult({ die1: 3, die2: 5 });
      });

      expect(result.current.status).toBe('gameOver');

      act(() => {
        result.current.addCash(500);
      });

      expect(result.current.cash).toBe(500);
      expect(result.current.status).toBe('idle');
    });
  });

  describe('computed values', () => {
    test('totalBet returns sum of all bets', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.placeBet(1, 100);
        result.current.placeBet(3, 200);
      });

      expect(result.current.totalBet).toBe(300);
    });

    test('canRoll returns true when bets placed and idle', () => {
      const { result } = renderHook(() => useGameStore());

      expect(result.current.canRoll).toBe(false);

      act(() => {
        result.current.placeBet(1, 100);
      });

      expect(result.current.canRoll).toBe(true);
    });

    test('canRoll returns false when rolling', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.placeBet(1, 100);
        result.current.rollDice();
      });

      expect(result.current.canRoll).toBe(false);
    });
  });
});
