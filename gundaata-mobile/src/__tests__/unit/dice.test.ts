/**
 * Dice Module Tests
 * TDD: These tests are written BEFORE implementation
 * Tests should FAIL initially (Red), then we implement to make them pass (Green)
 */

import { rollSingleDie, rollDice, isDiceValueValid } from '../../utils/dice';

describe('Dice Module', () => {

  describe('rollSingleDie', () => {
    test('returns a number between 1 and 6 inclusive', () => {
      for (let i = 0; i < 1000; i++) {
        const result = rollSingleDie();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
      }
    });

    test('returns an integer', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollSingleDie();
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    test('distribution is approximately uniform over large sample', () => {
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const iterations = 60000;

      for (let i = 0; i < iterations; i++) {
        const value = rollSingleDie();
        counts[value]++;
      }

      // Each number should appear ~16.67% of the time (±10% tolerance)
      const expectedCount = iterations / 6;
      const tolerance = expectedCount * 0.1;

      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(expectedCount - tolerance);
        expect(count).toBeLessThan(expectedCount + tolerance);
      });
    });
  });

  describe('rollDice', () => {
    test('returns object with die1 and die2 properties', () => {
      const result = rollDice();
      expect(result).toHaveProperty('die1');
      expect(result).toHaveProperty('die2');
    });

    test('both dice are within valid range', () => {
      for (let i = 0; i < 100; i++) {
        const { die1, die2 } = rollDice();
        expect(die1).toBeGreaterThanOrEqual(1);
        expect(die1).toBeLessThanOrEqual(6);
        expect(die2).toBeGreaterThanOrEqual(1);
        expect(die2).toBeLessThanOrEqual(6);
      }
    });

    test('dice are rolled independently (can have same or different values)', () => {
      let sameCount = 0;
      let diffCount = 0;

      for (let i = 0; i < 1000; i++) {
        const { die1, die2 } = rollDice();
        if (die1 === die2) sameCount++;
        else diffCount++;
      }

      // Should have both cases occur
      expect(sameCount).toBeGreaterThan(0);
      expect(diffCount).toBeGreaterThan(0);
      // Probability of same is 1/6 ≈ 16.67%, so different should be more common
      expect(diffCount).toBeGreaterThan(sameCount);
    });

    test('both dice values are integers', () => {
      for (let i = 0; i < 100; i++) {
        const { die1, die2 } = rollDice();
        expect(Number.isInteger(die1)).toBe(true);
        expect(Number.isInteger(die2)).toBe(true);
      }
    });
  });

  describe('isDiceValueValid', () => {
    test('returns true for values 1-6', () => {
      [1, 2, 3, 4, 5, 6].forEach(val => {
        expect(isDiceValueValid(val)).toBe(true);
      });
    });

    test('returns false for 0', () => {
      expect(isDiceValueValid(0)).toBe(false);
    });

    test('returns false for 7 and above', () => {
      expect(isDiceValueValid(7)).toBe(false);
      expect(isDiceValueValid(100)).toBe(false);
    });

    test('returns false for negative numbers', () => {
      expect(isDiceValueValid(-1)).toBe(false);
      expect(isDiceValueValid(-100)).toBe(false);
    });

    test('returns false for non-integers', () => {
      expect(isDiceValueValid(3.5)).toBe(false);
      expect(isDiceValueValid(1.1)).toBe(false);
    });

    test('returns false for NaN', () => {
      expect(isDiceValueValid(NaN)).toBe(false);
    });

    test('returns false for Infinity', () => {
      expect(isDiceValueValid(Infinity)).toBe(false);
      expect(isDiceValueValid(-Infinity)).toBe(false);
    });
  });
});
