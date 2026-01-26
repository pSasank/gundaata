/**
 * Dice Module
 * Core dice rolling and validation functionality
 */

export interface DiceRoll {
  die1: number;
  die2: number;
}

/**
 * Rolls a single die and returns a value between 1-6
 */
export function rollSingleDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Rolls two dice and returns the results
 */
export function rollDice(): DiceRoll {
  return {
    die1: rollSingleDie(),
    die2: rollSingleDie(),
  };
}

/**
 * Validates if a value is a valid dice value (1-6, integer)
 */
export function isDiceValueValid(value: number): boolean {
  if (typeof value !== 'number') return false;
  if (!Number.isFinite(value)) return false;
  if (!Number.isInteger(value)) return false;
  return value >= 1 && value <= 6;
}
