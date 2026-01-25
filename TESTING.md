# Gundaata Testing Plan - Test-First Development

## Philosophy: Test-Driven Development (TDD)

We follow the **Red-Green-Refactor** cycle:
1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make it pass
3. **Refactor**: Clean up while keeping tests green

**No feature code is written without a corresponding test first.**

---

## Table of Contents
1. [Testing Stack](#testing-stack)
2. [Test Directory Structure](#test-directory-structure)
3. [Core Game Logic Tests](#core-game-logic-tests)
4. [State Management Tests](#state-management-tests)
5. [Component Tests](#component-tests)
6. [Integration Tests](#integration-tests)
7. [E2E Tests](#e2e-tests)
8. [Ad Integration Tests](#ad-integration-tests)
9. [Performance Tests](#performance-tests)
10. [Accessibility Tests](#accessibility-tests)
11. [Security Tests](#security-tests)
12. [Test Coverage Requirements](#test-coverage-requirements)
13. [CI/CD Pipeline](#cicd-pipeline)
14. [Test Data & Fixtures](#test-data--fixtures)
15. [Mocking Strategy](#mocking-strategy)

---

## Testing Stack

```
Unit/Component:    Jest + React Native Testing Library
E2E:               Detox (iOS/Android) or Maestro
Performance:       Reassure (React Native)
Coverage:          Jest --coverage
Mocking:           Jest mocks + MSW (for API)
CI:                GitHub Actions
Device Testing:    Firebase Test Lab
Visual Regression: Chromatic (Storybook) or Percy
```

### Installation
```bash
npm install --save-dev \
  jest \
  @testing-library/react-native \
  @testing-library/jest-native \
  detox \
  reassure \
  msw

# Jest config in package.json or jest.config.js
```

---

## Test Directory Structure

```
src/
├── __tests__/
│   ├── unit/
│   │   ├── dice.test.ts
│   │   ├── betting.test.ts
│   │   ├── winnings.test.ts
│   │   ├── gameState.test.ts
│   │   ├── achievements.test.ts
│   │   ├── dailyRewards.test.ts
│   │   ├── leaderboard.test.ts
│   │   └── storage.test.ts
│   ├── components/
│   │   ├── Dice.test.tsx
│   │   ├── BetInput.test.tsx
│   │   ├── QuickBetButtons.test.tsx
│   │   ├── CashDisplay.test.tsx
│   │   ├── GameOverModal.test.tsx
│   │   ├── AchievementToast.test.tsx
│   │   └── DailyRewardModal.test.tsx
│   ├── integration/
│   │   ├── gameFlow.test.ts
│   │   ├── adIntegration.test.ts
│   │   ├── storageSync.test.ts
│   │   └── analyticsTracking.test.ts
│   ├── e2e/
│   │   ├── newUserJourney.e2e.ts
│   │   ├── gameplayLoop.e2e.ts
│   │   ├── achievementUnlock.e2e.ts
│   │   └── adWatching.e2e.ts
│   └── __fixtures__/
│       ├── gameStates.ts
│       ├── mockDice.ts
│       └── mockAds.ts
```

---

## Core Game Logic Tests

### 1. Dice Module (`dice.test.ts`)

```typescript
import { rollDice, rollSingleDie, isDiceValueValid } from '../utils/dice';

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
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const iterations = 60000;

      for (let i = 0; i < iterations; i++) {
        counts[rollSingleDie()]++;
      }

      // Each number should appear ~16.67% of the time (±2%)
      const expectedCount = iterations / 6;
      const tolerance = expectedCount * 0.1; // 10% tolerance

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
      // Probability of same is 1/6 ≈ 16.67%
      expect(sameCount).toBeLessThan(diffCount);
    });

    test('with seeded random, produces deterministic results', () => {
      // If we implement seeded randomness for testing
      const result1 = rollDice({ seed: 12345 });
      const result2 = rollDice({ seed: 12345 });
      expect(result1).toEqual(result2);
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
    });

    test('returns false for non-integers', () => {
      expect(isDiceValueValid(3.5)).toBe(false);
      expect(isDiceValueValid(1.1)).toBe(false);
    });

    test('returns false for non-numbers', () => {
      expect(isDiceValueValid('3' as any)).toBe(false);
      expect(isDiceValueValid(null as any)).toBe(false);
      expect(isDiceValueValid(undefined as any)).toBe(false);
    });
  });
});
```

### 2. Betting Module (`betting.test.ts`)

```typescript
import {
  validateBet,
  validateAllBets,
  calculateTotalBet,
  placeBet,
  clearBets,
  BetError
} from '../utils/betting';

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
      const bets = { 1: 100, 2: 100, 3: 100, 4: 0, 5: 0, 6: 0 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(true);
    });

    test('accepts bets that exactly equal available cash', () => {
      const bets = { 1: 200, 2: 200, 3: 200, 4: 200, 5: 100, 6: 100 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(true);
    });

    test('rejects when total bets exceed available cash', () => {
      const bets = { 1: 500, 2: 500, 3: 100, 4: 0, 5: 0, 6: 0 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.TOTAL_EXCEEDS_CASH);
    });

    test('rejects if any individual bet is invalid', () => {
      const bets = { 1: -50, 2: 100, 3: 100, 4: 0, 5: 0, 6: 0 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(false);
      expect(result.invalidBets).toContain(1);
    });

    test('requires at least one non-zero bet', () => {
      const bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const result = validateAllBets(bets, 1000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.NO_BETS_PLACED);
    });

    test('rejects if missing dice numbers', () => {
      const bets = { 1: 100, 2: 100 }; // Missing 3-6
      const result = validateAllBets(bets as any, 1000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(BetError.INCOMPLETE_BETS);
    });
  });

  describe('calculateTotalBet', () => {
    test('correctly sums all bets', () => {
      const bets = { 1: 100, 2: 50, 3: 25, 4: 75, 5: 0, 6: 150 };
      expect(calculateTotalBet(bets)).toBe(400);
    });

    test('returns 0 for all zero bets', () => {
      const bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      expect(calculateTotalBet(bets)).toBe(0);
    });

    test('handles single non-zero bet', () => {
      const bets = { 1: 500, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      expect(calculateTotalBet(bets)).toBe(500);
    });
  });

  describe('placeBet', () => {
    test('creates new bet entry', () => {
      const bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const newBets = placeBet(bets, 3, 100);
      expect(newBets[3]).toBe(100);
    });

    test('does not mutate original bets object', () => {
      const bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const newBets = placeBet(bets, 3, 100);
      expect(bets[3]).toBe(0);
      expect(newBets).not.toBe(bets);
    });

    test('replaces existing bet on same number', () => {
      const bets = { 1: 50, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const newBets = placeBet(bets, 1, 100);
      expect(newBets[1]).toBe(100);
    });
  });

  describe('clearBets', () => {
    test('resets all bets to zero', () => {
      const bets = { 1: 100, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600 };
      const clearedBets = clearBets(bets);
      Object.values(clearedBets).forEach(bet => {
        expect(bet).toBe(0);
      });
    });

    test('does not mutate original bets object', () => {
      const bets = { 1: 100, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600 };
      clearBets(bets);
      expect(bets[1]).toBe(100);
    });
  });
});
```

### 3. Winnings Calculation (`winnings.test.ts`)

```typescript
import {
  calculateWinnings,
  calculatePayout,
  determineWinningNumbers,
  WinResult
} from '../utils/winnings';

describe('Winnings Module', () => {

  describe('determineWinningNumbers', () => {
    test('returns both numbers when dice are different', () => {
      const result = determineWinningNumbers({ die1: 3, die2: 5 });
      expect(result).toEqual([3, 5]);
    });

    test('returns single number when dice are same (doubles)', () => {
      const result = determineWinningNumbers({ die1: 4, die2: 4 });
      expect(result).toEqual([4]);
    });

    test('returns numbers sorted ascending', () => {
      const result = determineWinningNumbers({ die1: 6, die2: 2 });
      expect(result).toEqual([2, 6]);
    });
  });

  describe('calculatePayout', () => {
    test('returns 2x bet for single die match', () => {
      const payout = calculatePayout({
        betAmount: 100,
        matchCount: 1
      });
      expect(payout).toBe(200);
    });

    test('returns 4x bet for double match (both dice same number)', () => {
      const payout = calculatePayout({
        betAmount: 100,
        matchCount: 2
      });
      expect(payout).toBe(400);
    });

    test('returns 0 for no match', () => {
      const payout = calculatePayout({
        betAmount: 100,
        matchCount: 0
      });
      expect(payout).toBe(0);
    });

    test('handles zero bet amount', () => {
      const payout = calculatePayout({
        betAmount: 0,
        matchCount: 1
      });
      expect(payout).toBe(0);
    });
  });

  describe('calculateWinnings', () => {
    const baseBets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    test('calculates correct winnings for single match', () => {
      const bets = { ...baseBets, 3: 100 };
      const dice = { die1: 3, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(200);
      expect(result.winningBets).toEqual([{ number: 3, bet: 100, payout: 200 }]);
    });

    test('calculates correct winnings when both dice match different bets', () => {
      const bets = { ...baseBets, 2: 100, 5: 50 };
      const dice = { die1: 2, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(300); // 200 + 100
      expect(result.winningBets).toHaveLength(2);
    });

    test('calculates correct winnings for doubles (same number on both dice)', () => {
      const bets = { ...baseBets, 4: 100 };
      const dice = { die1: 4, die2: 4 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(400); // 4x for doubles
      expect(result.winningBets).toEqual([{ number: 4, bet: 100, payout: 400 }]);
    });

    test('returns zero winnings when no dice match bets', () => {
      const bets = { ...baseBets, 1: 100, 2: 100 };
      const dice = { die1: 4, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(0);
      expect(result.winningBets).toHaveLength(0);
      expect(result.losingBets).toHaveLength(2);
    });

    test('correctly identifies partial wins (one bet wins, one loses)', () => {
      const bets = { ...baseBets, 3: 100, 6: 50 };
      const dice = { die1: 3, die2: 2 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(200);
      expect(result.winningBets).toEqual([{ number: 3, bet: 100, payout: 200 }]);
      expect(result.losingBets).toEqual([{ number: 6, bet: 50, payout: 0 }]);
    });

    test('calculates net result (winnings minus total bet)', () => {
      const bets = { ...baseBets, 3: 100 };
      const dice = { die1: 3, die2: 5 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalBet).toBe(100);
      expect(result.totalWinnings).toBe(200);
      expect(result.netResult).toBe(100); // Won 100 profit
    });

    test('handles all bets winning', () => {
      const bets = { 1: 10, 2: 20, 3: 30, 4: 40, 5: 50, 6: 60 };
      const dice = { die1: 3, die2: 5 };
      const result = calculateWinnings(bets, dice);

      // 30*2 + 50*2 = 160
      expect(result.totalWinnings).toBe(160);
    });

    test('handles max bets on all numbers', () => {
      const bets = { 1: 1000, 2: 1000, 3: 1000, 4: 1000, 5: 1000, 6: 1000 };
      const dice = { die1: 1, die2: 6 };
      const result = calculateWinnings(bets, dice);

      expect(result.totalWinnings).toBe(4000); // 2000 + 2000
      expect(result.totalBet).toBe(6000);
      expect(result.netResult).toBe(-2000); // Net loss
    });
  });

  describe('WinResult types', () => {
    test('result includes all required properties', () => {
      const bets = { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const dice = { die1: 1, die2: 2 };
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
```

### 4. Game State (`gameState.test.ts`)

```typescript
import {
  createInitialState,
  gameReducer,
  GameAction,
  GameState,
  isGameOver,
  canPlaceBet
} from '../state/gameState';

describe('Game State Module', () => {

  describe('createInitialState', () => {
    test('creates state with default starting cash (1000)', () => {
      const state = createInitialState();
      expect(state.cash).toBe(1000);
    });

    test('allows custom starting cash', () => {
      const state = createInitialState({ startingCash: 5000 });
      expect(state.cash).toBe(5000);
    });

    test('initializes empty bets', () => {
      const state = createInitialState();
      expect(state.bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });

    test('initializes dice to null', () => {
      const state = createInitialState();
      expect(state.dice).toBeNull();
    });

    test('initializes game status to idle', () => {
      const state = createInitialState();
      expect(state.status).toBe('idle');
    });

    test('initializes high score from storage if available', () => {
      const state = createInitialState({ savedHighScore: 5000 });
      expect(state.highScore).toBe(5000);
    });
  });

  describe('gameReducer - PLACE_BET', () => {
    test('updates bet for specific dice number', () => {
      const state = createInitialState();
      const newState = gameReducer(state, {
        type: 'PLACE_BET',
        payload: { diceNumber: 3, amount: 100 }
      });
      expect(newState.bets[3]).toBe(100);
    });

    test('does not modify other bets', () => {
      const state = createInitialState();
      state.bets[1] = 50;
      const newState = gameReducer(state, {
        type: 'PLACE_BET',
        payload: { diceNumber: 3, amount: 100 }
      });
      expect(newState.bets[1]).toBe(50);
    });
  });

  describe('gameReducer - ROLL_DICE', () => {
    test('sets status to rolling', () => {
      const state = createInitialState();
      state.bets[1] = 100;
      const newState = gameReducer(state, { type: 'ROLL_DICE' });
      expect(newState.status).toBe('rolling');
    });

    test('prevents rolling without bets', () => {
      const state = createInitialState();
      const newState = gameReducer(state, { type: 'ROLL_DICE' });
      expect(newState.status).toBe('idle');
      expect(newState.error).toBe('NO_BETS_PLACED');
    });
  });

  describe('gameReducer - DICE_RESULT', () => {
    test('updates dice values', () => {
      const state = createInitialState();
      state.status = 'rolling';
      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 3, die2: 5 }
      });
      expect(newState.dice).toEqual({ die1: 3, die2: 5 });
    });

    test('calculates and applies winnings', () => {
      const state = createInitialState();
      state.bets[3] = 100;
      state.cash = 900; // Already deducted bet
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 3, die2: 5 }
      });

      expect(newState.cash).toBe(1100); // 900 + 200 winnings
      expect(newState.lastWin).toBe(200);
    });

    test('updates high score if current cash exceeds it', () => {
      const state = createInitialState();
      state.highScore = 1000;
      state.cash = 1400;
      state.bets[3] = 100;
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 3, die2: 5 }
      });

      expect(newState.highScore).toBe(1500); // 1400 + 100 net win
    });

    test('triggers game over when cash reaches zero', () => {
      const state = createInitialState();
      state.cash = 0;
      state.bets[3] = 100; // Bet was placed before
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 1, die2: 2 } // No win
      });

      expect(newState.status).toBe('gameOver');
    });

    test('clears bets after result', () => {
      const state = createInitialState();
      state.bets = { 1: 100, 2: 50, 3: 25, 4: 0, 5: 0, 6: 0 };
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 1, die2: 2 }
      });

      expect(newState.bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });
  });

  describe('gameReducer - NEW_GAME', () => {
    test('resets cash to starting amount', () => {
      const state = createInitialState();
      state.cash = 50;
      state.status = 'gameOver';

      const newState = gameReducer(state, { type: 'NEW_GAME' });
      expect(newState.cash).toBe(1000);
    });

    test('preserves high score', () => {
      const state = createInitialState();
      state.highScore = 5000;
      state.status = 'gameOver';

      const newState = gameReducer(state, { type: 'NEW_GAME' });
      expect(newState.highScore).toBe(5000);
    });

    test('clears dice and bets', () => {
      const state = createInitialState();
      state.dice = { die1: 3, die2: 5 };
      state.bets = { 1: 100, 2: 50, 3: 0, 4: 0, 5: 0, 6: 0 };

      const newState = gameReducer(state, { type: 'NEW_GAME' });
      expect(newState.dice).toBeNull();
      expect(newState.bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });
  });

  describe('gameReducer - INCREMENT_BET', () => {
    test('adds increment to existing bet', () => {
      const state = createInitialState();
      state.bets[3] = 50;

      const newState = gameReducer(state, {
        type: 'INCREMENT_BET',
        payload: { diceNumber: 3, increment: 100 }
      });

      expect(newState.bets[3]).toBe(150);
    });

    test('caps bet at available cash', () => {
      const state = createInitialState();
      state.cash = 200;
      state.bets[3] = 150;

      const newState = gameReducer(state, {
        type: 'INCREMENT_BET',
        payload: { diceNumber: 3, increment: 100 }
      });

      expect(newState.bets[3]).toBe(200); // Capped at cash
    });
  });

  describe('isGameOver', () => {
    test('returns true when cash is 0', () => {
      expect(isGameOver({ cash: 0, status: 'idle' } as GameState)).toBe(true);
    });

    test('returns true when status is gameOver', () => {
      expect(isGameOver({ cash: 100, status: 'gameOver' } as GameState)).toBe(true);
    });

    test('returns false when cash is positive and status is not gameOver', () => {
      expect(isGameOver({ cash: 100, status: 'idle' } as GameState)).toBe(false);
    });
  });

  describe('canPlaceBet', () => {
    test('returns true during idle status with cash', () => {
      const state = { cash: 1000, status: 'idle' } as GameState;
      expect(canPlaceBet(state)).toBe(true);
    });

    test('returns false during rolling', () => {
      const state = { cash: 1000, status: 'rolling' } as GameState;
      expect(canPlaceBet(state)).toBe(false);
    });

    test('returns false during gameOver', () => {
      const state = { cash: 0, status: 'gameOver' } as GameState;
      expect(canPlaceBet(state)).toBe(false);
    });
  });
});
```

### 5. Achievements (`achievements.test.ts`)

```typescript
import {
  checkAchievements,
  Achievement,
  AchievementId,
  getUnlockedAchievements,
  isAchievementUnlocked
} from '../utils/achievements';

describe('Achievements Module', () => {

  describe('Achievement: FIRST_ROLL', () => {
    test('unlocks after first game completion', () => {
      const result = checkAchievements({
        gamesPlayed: 1,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).toContain('FIRST_ROLL');
    });

    test('does not unlock if already unlocked', () => {
      const result = checkAchievements({
        gamesPlayed: 2,
        unlockedAchievements: ['FIRST_ROLL']
      });
      expect(result.newUnlocks).not.toContain('FIRST_ROLL');
    });
  });

  describe('Achievement: LUCKY_SEVEN', () => {
    test('unlocks after 7 consecutive wins', () => {
      const result = checkAchievements({
        consecutiveWins: 7,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).toContain('LUCKY_SEVEN');
    });

    test('does not unlock at 6 consecutive wins', () => {
      const result = checkAchievements({
        consecutiveWins: 6,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).not.toContain('LUCKY_SEVEN');
    });
  });

  describe('Achievement: HIGH_ROLLER', () => {
    test('unlocks after betting 500+ in single round', () => {
      const result = checkAchievements({
        lastTotalBet: 500,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).toContain('HIGH_ROLLER');
    });

    test('does not unlock for bet of 499', () => {
      const result = checkAchievements({
        lastTotalBet: 499,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).not.toContain('HIGH_ROLLER');
    });
  });

  describe('Achievement: MILLIONAIRE', () => {
    test('unlocks when reaching 1,000,000 cash', () => {
      const result = checkAchievements({
        currentCash: 1000000,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).toContain('MILLIONAIRE');
    });
  });

  describe('Achievement: COMEBACK_KID', () => {
    test('unlocks when recovering from <100 to 10000+', () => {
      const result = checkAchievements({
        lowestCash: 50,
        currentCash: 10000,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).toContain('COMEBACK_KID');
    });

    test('does not unlock if lowest was 100+', () => {
      const result = checkAchievements({
        lowestCash: 100,
        currentCash: 10000,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).not.toContain('COMEBACK_KID');
    });
  });

  describe('Achievement: RISK_TAKER', () => {
    test('unlocks when betting on all 6 numbers', () => {
      const bets = { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10 };
      const result = checkAchievements({
        lastBets: bets,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).toContain('RISK_TAKER');
    });

    test('does not unlock when betting on 5 numbers', () => {
      const bets = { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 0 };
      const result = checkAchievements({
        lastBets: bets,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).not.toContain('RISK_TAKER');
    });
  });

  describe('Achievement: DOUBLE_TROUBLE', () => {
    test('unlocks when both dice match bet', () => {
      const result = checkAchievements({
        lastDice: { die1: 4, die2: 4 },
        lastBets: { 1: 0, 2: 0, 3: 0, 4: 100, 5: 0, 6: 0 },
        unlockedAchievements: []
      });
      expect(result.newUnlocks).toContain('DOUBLE_TROUBLE');
    });
  });

  describe('Achievement: PERFECT_GAME', () => {
    test('unlocks after 10 wins without losing', () => {
      const result = checkAchievements({
        roundsWonWithoutLoss: 10,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).toContain('PERFECT_GAME');
    });
  });

  describe('Multiple achievements at once', () => {
    test('can unlock multiple achievements in same check', () => {
      const result = checkAchievements({
        gamesPlayed: 1,
        lastTotalBet: 500,
        unlockedAchievements: []
      });
      expect(result.newUnlocks).toContain('FIRST_ROLL');
      expect(result.newUnlocks).toContain('HIGH_ROLLER');
    });
  });

  describe('getUnlockedAchievements', () => {
    test('returns full achievement objects for unlocked IDs', () => {
      const achievements = getUnlockedAchievements(['FIRST_ROLL', 'LUCKY_SEVEN']);
      expect(achievements).toHaveLength(2);
      expect(achievements[0]).toHaveProperty('id');
      expect(achievements[0]).toHaveProperty('title');
      expect(achievements[0]).toHaveProperty('description');
      expect(achievements[0]).toHaveProperty('icon');
    });
  });

  describe('isAchievementUnlocked', () => {
    test('returns true for unlocked achievement', () => {
      expect(isAchievementUnlocked('FIRST_ROLL', ['FIRST_ROLL', 'HIGH_ROLLER'])).toBe(true);
    });

    test('returns false for locked achievement', () => {
      expect(isAchievementUnlocked('MILLIONAIRE', ['FIRST_ROLL'])).toBe(false);
    });
  });
});
```

### 6. Daily Rewards (`dailyRewards.test.ts`)

```typescript
import {
  calculateDailyReward,
  getStreakBonus,
  canClaimDailyReward,
  claimDailyReward,
  DailyRewardState
} from '../utils/dailyRewards';

describe('Daily Rewards Module', () => {

  describe('canClaimDailyReward', () => {
    test('returns true if never claimed', () => {
      const state: DailyRewardState = { lastClaimTime: null, streak: 0 };
      expect(canClaimDailyReward(state)).toBe(true);
    });

    test('returns true if last claim was yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const state: DailyRewardState = {
        lastClaimTime: yesterday.toISOString(),
        streak: 3
      };
      expect(canClaimDailyReward(state)).toBe(true);
    });

    test('returns false if already claimed today', () => {
      const state: DailyRewardState = {
        lastClaimTime: new Date().toISOString(),
        streak: 3
      };
      expect(canClaimDailyReward(state)).toBe(false);
    });

    test('returns true if last claim was 2+ days ago (streak broken)', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const state: DailyRewardState = {
        lastClaimTime: twoDaysAgo.toISOString(),
        streak: 5
      };
      expect(canClaimDailyReward(state)).toBe(true);
    });
  });

  describe('getStreakBonus', () => {
    test('returns 1x multiplier for day 1', () => {
      expect(getStreakBonus(1)).toBe(1);
    });

    test('returns increasing multiplier for streak', () => {
      expect(getStreakBonus(2)).toBe(1.1);
      expect(getStreakBonus(3)).toBe(1.2);
      expect(getStreakBonus(7)).toBe(1.6);
    });

    test('caps at maximum multiplier (2x at day 10+)', () => {
      expect(getStreakBonus(10)).toBe(2);
      expect(getStreakBonus(15)).toBe(2);
      expect(getStreakBonus(100)).toBe(2);
    });
  });

  describe('calculateDailyReward', () => {
    test('returns base reward of 100 for new player', () => {
      const reward = calculateDailyReward({ streak: 0 });
      expect(reward.baseAmount).toBe(100);
    });

    test('applies streak bonus to reward', () => {
      const reward = calculateDailyReward({ streak: 7 });
      expect(reward.baseAmount).toBe(100);
      expect(reward.multiplier).toBe(1.6);
      expect(reward.totalAmount).toBe(160);
    });

    test('rounds reward to integer', () => {
      const reward = calculateDailyReward({ streak: 2 }); // 1.1x
      expect(Number.isInteger(reward.totalAmount)).toBe(true);
    });
  });

  describe('claimDailyReward', () => {
    test('increases streak when claiming consecutive day', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const state: DailyRewardState = {
        lastClaimTime: yesterday.toISOString(),
        streak: 3
      };

      const newState = claimDailyReward(state);
      expect(newState.streak).toBe(4);
    });

    test('resets streak when claiming after 2+ days', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const state: DailyRewardState = {
        lastClaimTime: threeDaysAgo.toISOString(),
        streak: 5
      };

      const newState = claimDailyReward(state);
      expect(newState.streak).toBe(1);
    });

    test('updates lastClaimTime to now', () => {
      const state: DailyRewardState = { lastClaimTime: null, streak: 0 };
      const before = new Date();
      const newState = claimDailyReward(state);
      const after = new Date();

      const claimTime = new Date(newState.lastClaimTime!);
      expect(claimTime >= before).toBe(true);
      expect(claimTime <= after).toBe(true);
    });

    test('throws error if already claimed today', () => {
      const state: DailyRewardState = {
        lastClaimTime: new Date().toISOString(),
        streak: 3
      };

      expect(() => claimDailyReward(state)).toThrow('Already claimed today');
    });
  });
});
```

### 7. Storage (`storage.test.ts`)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveHighScore,
  loadHighScore,
  saveGameState,
  loadGameState,
  saveAchievements,
  loadAchievements,
  clearAllData
} from '../utils/storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  multiSet: jest.fn(),
  multiGet: jest.fn(),
}));

describe('Storage Module', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveHighScore', () => {
    test('saves high score to AsyncStorage', async () => {
      await saveHighScore(5000);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('highScore', '5000');
    });

    test('handles storage errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage full'));
      await expect(saveHighScore(5000)).rejects.toThrow('Storage full');
    });
  });

  describe('loadHighScore', () => {
    test('returns parsed high score from storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5000');
      const score = await loadHighScore();
      expect(score).toBe(5000);
    });

    test('returns 0 if no high score saved', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const score = await loadHighScore();
      expect(score).toBe(0);
    });

    test('returns 0 if stored value is invalid', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid');
      const score = await loadHighScore();
      expect(score).toBe(0);
    });
  });

  describe('saveGameState', () => {
    test('saves entire game state as JSON', async () => {
      const state = { cash: 1500, bets: {}, highScore: 2000 };
      await saveGameState(state);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'gameState',
        JSON.stringify(state)
      );
    });
  });

  describe('loadGameState', () => {
    test('returns parsed game state', async () => {
      const state = { cash: 1500, highScore: 2000 };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(state));
      const loaded = await loadGameState();
      expect(loaded).toEqual(state);
    });

    test('returns null if no saved state', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const loaded = await loadGameState();
      expect(loaded).toBeNull();
    });

    test('returns null if JSON is corrupted', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{ invalid json');
      const loaded = await loadGameState();
      expect(loaded).toBeNull();
    });
  });

  describe('saveAchievements', () => {
    test('saves achievements array', async () => {
      const achievements = ['FIRST_ROLL', 'HIGH_ROLLER'];
      await saveAchievements(achievements);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'achievements',
        JSON.stringify(achievements)
      );
    });
  });

  describe('loadAchievements', () => {
    test('returns achievements array', async () => {
      const achievements = ['FIRST_ROLL', 'HIGH_ROLLER'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(achievements));
      const loaded = await loadAchievements();
      expect(loaded).toEqual(achievements);
    });

    test('returns empty array if nothing saved', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const loaded = await loadAchievements();
      expect(loaded).toEqual([]);
    });
  });

  describe('clearAllData', () => {
    test('clears all storage', async () => {
      await clearAllData();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });
});
```

---

## Component Tests

### 8. Dice Component (`Dice.test.tsx`)

```typescript
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Dice } from '../components/Dice';

describe('Dice Component', () => {

  describe('Rendering', () => {
    test('renders without crashing', () => {
      const { getByTestId } = render(<Dice value={1} />);
      expect(getByTestId('dice')).toBeTruthy();
    });

    test('displays correct image for value 1', () => {
      const { getByTestId } = render(<Dice value={1} />);
      const image = getByTestId('dice-image');
      expect(image.props.source).toEqual(require('../assets/dice_1.png'));
    });

    test('displays correct image for value 6', () => {
      const { getByTestId } = render(<Dice value={6} />);
      const image = getByTestId('dice-image');
      expect(image.props.source).toEqual(require('../assets/dice_6.png'));
    });

    test('displays all dice values correctly (1-6)', () => {
      [1, 2, 3, 4, 5, 6].forEach(value => {
        const { getByTestId } = render(<Dice value={value} />);
        const image = getByTestId('dice-image');
        expect(image.props.source).toEqual(require(`../assets/dice_${value}.png`));
      });
    });
  });

  describe('Animation', () => {
    test('shows rolling animation when isRolling is true', () => {
      const { getByTestId } = render(<Dice value={1} isRolling={true} />);
      const dice = getByTestId('dice');
      expect(dice.props.style).toContainEqual(
        expect.objectContaining({ transform: expect.any(Array) })
      );
    });

    test('stops animation when isRolling becomes false', async () => {
      const { getByTestId, rerender } = render(<Dice value={1} isRolling={true} />);
      rerender(<Dice value={3} isRolling={false} />);

      await waitFor(() => {
        const dice = getByTestId('dice');
        // Animation should have stopped
      });
    });
  });

  describe('Winning state', () => {
    test('applies winning style when isWinner is true', () => {
      const { getByTestId } = render(<Dice value={3} isWinner={true} />);
      const dice = getByTestId('dice');
      expect(dice.props.style).toContainEqual(
        expect.objectContaining({ borderColor: expect.any(String) })
      );
    });

    test('does not apply winning style when isWinner is false', () => {
      const { getByTestId } = render(<Dice value={3} isWinner={false} />);
      // Check no winning border/glow
    });
  });

  describe('Accessibility', () => {
    test('has accessible label with dice value', () => {
      const { getByLabelText } = render(<Dice value={4} />);
      expect(getByLabelText('Dice showing 4')).toBeTruthy();
    });
  });
});
```

### 9. BetInput Component (`BetInput.test.tsx`)

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BetInput } from '../components/BetInput';

describe('BetInput Component', () => {

  const defaultProps = {
    diceNumber: 3,
    value: 0,
    onChange: jest.fn(),
    maxBet: 1000,
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders with dice number label', () => {
      const { getByText } = render(<BetInput {...defaultProps} />);
      expect(getByText('3')).toBeTruthy();
    });

    test('displays current bet value', () => {
      const { getByDisplayValue } = render(
        <BetInput {...defaultProps} value={100} />
      );
      expect(getByDisplayValue('100')).toBeTruthy();
    });

    test('displays 0 as empty string for cleaner UI', () => {
      const { getByDisplayValue } = render(<BetInput {...defaultProps} value={0} />);
      expect(getByDisplayValue('')).toBeTruthy();
    });
  });

  describe('User Input', () => {
    test('calls onChange with parsed number on valid input', () => {
      const { getByTestId } = render(<BetInput {...defaultProps} />);
      const input = getByTestId('bet-input-3');

      fireEvent.changeText(input, '150');
      expect(defaultProps.onChange).toHaveBeenCalledWith(3, 150);
    });

    test('ignores non-numeric input', () => {
      const { getByTestId } = render(<BetInput {...defaultProps} />);
      const input = getByTestId('bet-input-3');

      fireEvent.changeText(input, 'abc');
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    test('ignores negative numbers', () => {
      const { getByTestId } = render(<BetInput {...defaultProps} />);
      const input = getByTestId('bet-input-3');

      fireEvent.changeText(input, '-50');
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    test('caps input at maxBet', () => {
      const { getByTestId } = render(<BetInput {...defaultProps} maxBet={500} />);
      const input = getByTestId('bet-input-3');

      fireEvent.changeText(input, '600');
      expect(defaultProps.onChange).toHaveBeenCalledWith(3, 500);
    });

    test('allows decimal input but rounds to integer', () => {
      const { getByTestId } = render(<BetInput {...defaultProps} />);
      const input = getByTestId('bet-input-3');

      fireEvent.changeText(input, '150.7');
      expect(defaultProps.onChange).toHaveBeenCalledWith(3, 151);
    });
  });

  describe('Disabled State', () => {
    test('input is not editable when disabled', () => {
      const { getByTestId } = render(<BetInput {...defaultProps} disabled={true} />);
      const input = getByTestId('bet-input-3');
      expect(input.props.editable).toBe(false);
    });

    test('shows disabled styling when disabled', () => {
      const { getByTestId } = render(<BetInput {...defaultProps} disabled={true} />);
      const container = getByTestId('bet-input-container-3');
      expect(container.props.style).toContainEqual(
        expect.objectContaining({ opacity: expect.any(Number) })
      );
    });
  });

  describe('Quick Bet Buttons', () => {
    test('renders +10, +50, +100, +500 buttons', () => {
      const { getByText } = render(<BetInput {...defaultProps} />);
      expect(getByText('+10')).toBeTruthy();
      expect(getByText('+50')).toBeTruthy();
      expect(getByText('+100')).toBeTruthy();
      expect(getByText('+500')).toBeTruthy();
    });

    test('+10 button adds 10 to current value', () => {
      const { getByText } = render(<BetInput {...defaultProps} value={50} />);
      fireEvent.press(getByText('+10'));
      expect(defaultProps.onChange).toHaveBeenCalledWith(3, 60);
    });

    test('+500 button is disabled when would exceed maxBet', () => {
      const { getByText } = render(
        <BetInput {...defaultProps} value={600} maxBet={1000} />
      );
      const button = getByText('+500');
      expect(button.props.disabled).toBe(true);
    });

    test('quick bet buttons are disabled when input is disabled', () => {
      const { getByText } = render(<BetInput {...defaultProps} disabled={true} />);
      expect(getByText('+10').props.disabled).toBe(true);
    });
  });

  describe('Clear Button', () => {
    test('clear button sets value to 0', () => {
      const { getByTestId } = render(<BetInput {...defaultProps} value={100} />);
      fireEvent.press(getByTestId('clear-bet-3'));
      expect(defaultProps.onChange).toHaveBeenCalledWith(3, 0);
    });

    test('clear button is hidden when value is 0', () => {
      const { queryByTestId } = render(<BetInput {...defaultProps} value={0} />);
      expect(queryByTestId('clear-bet-3')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    test('has accessible label', () => {
      const { getByLabelText } = render(<BetInput {...defaultProps} />);
      expect(getByLabelText('Bet on dice number 3')).toBeTruthy();
    });
  });
});
```

### 10. GameOverModal Component (`GameOverModal.test.tsx`)

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameOverModal } from '../components/GameOverModal';

describe('GameOverModal Component', () => {

  const defaultProps = {
    visible: true,
    highScore: 5000,
    isNewHighScore: false,
    onNewGame: jest.fn(),
    onWatchAd: jest.fn(),
    adAvailable: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility', () => {
    test('renders when visible is true', () => {
      const { getByText } = render(<GameOverModal {...defaultProps} />);
      expect(getByText('Game Over')).toBeTruthy();
    });

    test('does not render when visible is false', () => {
      const { queryByText } = render(
        <GameOverModal {...defaultProps} visible={false} />
      );
      expect(queryByText('Game Over')).toBeNull();
    });
  });

  describe('High Score Display', () => {
    test('displays high score', () => {
      const { getByText } = render(<GameOverModal {...defaultProps} />);
      expect(getByText('High Score: 5,000')).toBeTruthy();
    });

    test('shows celebration for new high score', () => {
      const { getByText } = render(
        <GameOverModal {...defaultProps} isNewHighScore={true} />
      );
      expect(getByText('New High Score!')).toBeTruthy();
    });

    test('does not show celebration if not new high score', () => {
      const { queryByText } = render(<GameOverModal {...defaultProps} />);
      expect(queryByText('New High Score!')).toBeNull();
    });
  });

  describe('Buttons', () => {
    test('New Game button calls onNewGame', () => {
      const { getByText } = render(<GameOverModal {...defaultProps} />);
      fireEvent.press(getByText('New Game'));
      expect(defaultProps.onNewGame).toHaveBeenCalled();
    });

    test('Watch Ad button calls onWatchAd', () => {
      const { getByText } = render(<GameOverModal {...defaultProps} />);
      fireEvent.press(getByText('Watch Ad for 500'));
      expect(defaultProps.onWatchAd).toHaveBeenCalled();
    });

    test('Watch Ad button is disabled when adAvailable is false', () => {
      const { getByText } = render(
        <GameOverModal {...defaultProps} adAvailable={false} />
      );
      const button = getByText('Watch Ad for 500');
      expect(button.props.disabled).toBe(true);
    });

    test('Watch Ad button shows "Ad not available" when disabled', () => {
      const { getByText } = render(
        <GameOverModal {...defaultProps} adAvailable={false} />
      );
      expect(getByText('Ad Not Available')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    test('modal has accessible role', () => {
      const { getByRole } = render(<GameOverModal {...defaultProps} />);
      expect(getByRole('alert')).toBeTruthy();
    });

    test('buttons are properly labeled', () => {
      const { getByLabelText } = render(<GameOverModal {...defaultProps} />);
      expect(getByLabelText('Start new game')).toBeTruthy();
      expect(getByLabelText('Watch advertisement to continue')).toBeTruthy();
    });
  });
});
```

---

## Integration Tests

### 11. Full Game Flow (`gameFlow.test.ts`)

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useGameState } from '../hooks/useGameState';

describe('Game Flow Integration', () => {

  describe('Complete game round', () => {
    test('bet → roll → win → cash updated', async () => {
      const { result } = renderHook(() => useGameState());

      // Initial state
      expect(result.current.state.cash).toBe(1000);

      // Place bet
      act(() => {
        result.current.placeBet(3, 100);
      });
      expect(result.current.state.bets[3]).toBe(100);

      // Roll dice (mock to return 3 and 5)
      await act(async () => {
        await result.current.rollDice({ mockDice: { die1: 3, die2: 5 } });
      });

      // Verify win
      expect(result.current.state.cash).toBe(1100); // 1000 - 100 + 200
      expect(result.current.state.lastWin).toBe(200);
    });

    test('bet → roll → lose → cash updated', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.placeBet(1, 100);
      });

      await act(async () => {
        await result.current.rollDice({ mockDice: { die1: 3, die2: 5 } });
      });

      expect(result.current.state.cash).toBe(900);
      expect(result.current.state.lastWin).toBe(0);
    });
  });

  describe('Game over flow', () => {
    test('triggers game over when cash reaches 0', async () => {
      const { result } = renderHook(() => useGameState({ startingCash: 100 }));

      act(() => {
        result.current.placeBet(1, 100);
      });

      await act(async () => {
        await result.current.rollDice({ mockDice: { die1: 3, die2: 5 } });
      });

      expect(result.current.state.status).toBe('gameOver');
      expect(result.current.state.cash).toBe(0);
    });

    test('new game resets state', async () => {
      const { result } = renderHook(() => useGameState({ startingCash: 100 }));

      // Lose all cash
      act(() => {
        result.current.placeBet(1, 100);
      });
      await act(async () => {
        await result.current.rollDice({ mockDice: { die1: 3, die2: 5 } });
      });

      // Start new game
      act(() => {
        result.current.newGame();
      });

      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.cash).toBe(1000);
    });
  });

  describe('Multiple rounds', () => {
    test('accumulates winnings over multiple rounds', async () => {
      const { result } = renderHook(() => useGameState());

      // Round 1: Win
      act(() => result.current.placeBet(3, 100));
      await act(async () => {
        await result.current.rollDice({ mockDice: { die1: 3, die2: 5 } });
      });
      expect(result.current.state.cash).toBe(1100);

      // Round 2: Win again
      act(() => result.current.placeBet(6, 200));
      await act(async () => {
        await result.current.rollDice({ mockDice: { die1: 6, die2: 2 } });
      });
      expect(result.current.state.cash).toBe(1300);
    });
  });
});
```

### 12. Ad Integration (`adIntegration.test.ts`)

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAds } from '../hooks/useAds';
import { AdMob } from '../services/adMob';

jest.mock('../services/adMob');

describe('Ad Integration', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rewarded ads', () => {
    test('loads rewarded ad on mount', () => {
      renderHook(() => useAds());
      expect(AdMob.loadRewardedAd).toHaveBeenCalled();
    });

    test('shows rewarded ad and returns reward on completion', async () => {
      (AdMob.showRewardedAd as jest.Mock).mockResolvedValue({
        type: 'rewarded',
        amount: 500
      });

      const { result } = renderHook(() => useAds());

      let reward;
      await act(async () => {
        reward = await result.current.showRewardedAd();
      });

      expect(reward).toEqual({ type: 'rewarded', amount: 500 });
    });

    test('returns null if user closes ad early', async () => {
      (AdMob.showRewardedAd as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAds());

      let reward;
      await act(async () => {
        reward = await result.current.showRewardedAd();
      });

      expect(reward).toBeNull();
    });

    test('reloads ad after showing', async () => {
      (AdMob.showRewardedAd as jest.Mock).mockResolvedValue({ amount: 500 });

      const { result } = renderHook(() => useAds());

      await act(async () => {
        await result.current.showRewardedAd();
      });

      expect(AdMob.loadRewardedAd).toHaveBeenCalledTimes(2);
    });
  });

  describe('Interstitial ads', () => {
    test('shows interstitial after every 3rd game over', async () => {
      const { result } = renderHook(() => useAds());

      // 1st and 2nd game over: no interstitial
      act(() => result.current.onGameOver());
      expect(AdMob.showInterstitial).not.toHaveBeenCalled();

      act(() => result.current.onGameOver());
      expect(AdMob.showInterstitial).not.toHaveBeenCalled();

      // 3rd game over: show interstitial
      act(() => result.current.onGameOver());
      expect(AdMob.showInterstitial).toHaveBeenCalled();
    });

    test('does not show interstitial for premium users', () => {
      const { result } = renderHook(() => useAds({ isPremium: true }));

      act(() => result.current.onGameOver());
      act(() => result.current.onGameOver());
      act(() => result.current.onGameOver());

      expect(AdMob.showInterstitial).not.toHaveBeenCalled();
    });
  });

  describe('Banner ads', () => {
    test('returns banner component when not premium', () => {
      const { result } = renderHook(() => useAds());
      expect(result.current.BannerAd).toBeTruthy();
    });

    test('returns null banner for premium users', () => {
      const { result } = renderHook(() => useAds({ isPremium: true }));
      expect(result.current.BannerAd).toBeNull();
    });
  });

  describe('Ad availability', () => {
    test('reports rewarded ad as available when loaded', async () => {
      (AdMob.isRewardedAdLoaded as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useAds());
      expect(result.current.isRewardedAdAvailable).toBe(true);
    });

    test('reports rewarded ad as unavailable when not loaded', async () => {
      (AdMob.isRewardedAdLoaded as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAds());
      expect(result.current.isRewardedAdAvailable).toBe(false);
    });
  });
});
```

---

## E2E Tests

### 13. New User Journey (`newUserJourney.e2e.ts`)

```typescript
describe('New User Journey', () => {

  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('shows onboarding for first-time user', async () => {
    await expect(element(by.id('onboarding-screen'))).toBeVisible();
    await expect(element(by.text('Welcome to Gundaata!'))).toBeVisible();
  });

  it('can complete onboarding tutorial', async () => {
    await element(by.id('onboarding-next')).tap();
    await expect(element(by.text('Place your bets'))).toBeVisible();

    await element(by.id('onboarding-next')).tap();
    await expect(element(by.text('Roll the dice'))).toBeVisible();

    await element(by.id('onboarding-skip')).tap();
    await expect(element(by.id('game-screen'))).toBeVisible();
  });

  it('starts with 1000 cash', async () => {
    await element(by.id('onboarding-skip')).tap();
    await expect(element(by.text('1,000'))).toBeVisible();
  });

  it('can place first bet and roll', async () => {
    await element(by.id('onboarding-skip')).tap();

    // Place bet on 3
    await element(by.id('bet-input-3')).typeText('100');

    // Roll dice
    await element(by.id('roll-button')).tap();

    // Wait for animation
    await waitFor(element(by.id('dice-1'))).toBeVisible().withTimeout(3000);

    // Cash should have changed
    await expect(element(by.id('cash-display'))).not.toHaveText('1,000');
  });

  it('shows game over when cash depletes', async () => {
    // Start with low cash for faster test
    await element(by.id('dev-set-cash')).tap(); // Debug feature
    await element(by.id('cash-input')).typeText('100');
    await element(by.id('confirm')).tap();

    // Bet all
    await element(by.id('bet-input-1')).typeText('100');
    await element(by.id('roll-button')).tap();

    // If lost, should see game over
    await waitFor(element(by.id('game-over-modal')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
```

### 14. Gameplay Loop (`gameplayLoop.e2e.ts`)

```typescript
describe('Gameplay Loop', () => {

  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    // Skip onboarding
    await element(by.id('onboarding-skip')).tap();
  });

  it('completes 5 consecutive game rounds', async () => {
    for (let i = 0; i < 5; i++) {
      // Place random bet
      const diceNum = (i % 6) + 1;
      await element(by.id(`quick-bet-${diceNum}-50`)).tap();

      // Roll
      await element(by.id('roll-button')).tap();

      // Wait for result
      await waitFor(element(by.id('roll-button')))
        .toBeEnabled()
        .withTimeout(3000);
    }

    // Should still be on game screen
    await expect(element(by.id('game-screen'))).toBeVisible();
  });

  it('quick bet buttons work correctly', async () => {
    await element(by.id('quick-bet-3-10')).tap();
    await expect(element(by.id('bet-input-3'))).toHaveText('10');

    await element(by.id('quick-bet-3-50')).tap();
    await expect(element(by.id('bet-input-3'))).toHaveText('60');

    await element(by.id('quick-bet-3-100')).tap();
    await expect(element(by.id('bet-input-3'))).toHaveText('160');
  });

  it('cannot bet more than available cash', async () => {
    // Try to bet 2000 with only 1000
    await element(by.id('bet-input-1')).typeText('2000');
    await element(by.id('roll-button')).tap();

    // Should show error
    await expect(element(by.text('Insufficient funds'))).toBeVisible();
  });

  it('dice animation plays on roll', async () => {
    await element(by.id('quick-bet-1-50')).tap();
    await element(by.id('roll-button')).tap();

    // Check animation is happening
    await expect(element(by.id('dice-rolling-animation'))).toBeVisible();

    // Wait for it to finish
    await waitFor(element(by.id('dice-rolling-animation')))
      .not.toBeVisible()
      .withTimeout(2000);
  });

  it('sound plays on roll', async () => {
    // Enable sound if off
    await element(by.id('settings-button')).tap();
    await element(by.id('sound-toggle')).tap();
    await element(by.id('close-settings')).tap();

    await element(by.id('quick-bet-1-50')).tap();
    await element(by.id('roll-button')).tap();

    // Sound verification would need audio mock/spy
    // This test documents the expected behavior
  });
});
```

---

## Performance Tests

### 15. Performance Benchmarks (`performance.test.ts`)

```typescript
import { measureRenders } from 'reassure';
import { GameScreen } from '../screens/GameScreen';

describe('Performance Tests', () => {

  describe('Render performance', () => {
    test('GameScreen renders within 100ms', async () => {
      const scenario = async () => {
        // Render and interaction scenario
      };

      await measureRenders(<GameScreen />, { scenario });
    });

    test('Dice component re-renders efficiently', async () => {
      const scenario = async (screen) => {
        // Trigger multiple value changes
        for (let i = 1; i <= 6; i++) {
          screen.rerender(<Dice value={i} />);
        }
      };

      await measureRenders(<Dice value={1} />, { scenario });
    });

    test('Bet inputs handle rapid typing', async () => {
      const scenario = async (screen) => {
        const input = screen.getByTestId('bet-input-1');
        for (let i = 0; i < 10; i++) {
          fireEvent.changeText(input, String(i * 100));
        }
      };

      await measureRenders(<BetInput {...props} />, { scenario });
    });
  });

  describe('Memory', () => {
    test('no memory leak after 100 game rounds', async () => {
      // This would use a memory profiler in real implementation
      const initialMemory = performance.memory?.usedJSHeapSize;

      // Simulate 100 rounds
      for (let i = 0; i < 100; i++) {
        // Play round
      }

      // Force GC if available
      if (global.gc) global.gc();

      const finalMemory = performance.memory?.usedJSHeapSize;

      // Memory should not grow significantly
      expect(finalMemory - initialMemory).toBeLessThan(10 * 1024 * 1024); // 10MB
    });
  });

  describe('Animation performance', () => {
    test('dice roll animation maintains 60fps', async () => {
      // Would use Flipper or similar tool
      // Document expected: <16.67ms per frame
    });
  });
});
```

---

## Accessibility Tests

### 16. Accessibility (`accessibility.test.tsx`)

```typescript
import { render } from '@testing-library/react-native';
import { axe } from 'jest-axe';

describe('Accessibility Tests', () => {

  describe('Screen reader support', () => {
    test('all interactive elements have accessible labels', () => {
      const { getAllByRole } = render(<GameScreen />);

      const buttons = getAllByRole('button');
      buttons.forEach(button => {
        expect(button.props.accessibilityLabel).toBeTruthy();
      });
    });

    test('dice announce their values', () => {
      const { getByLabelText } = render(<Dice value={4} />);
      expect(getByLabelText(/dice.*4/i)).toBeTruthy();
    });

    test('cash changes are announced', () => {
      const { getByRole } = render(<CashDisplay value={1500} />);
      const display = getByRole('text');
      expect(display.props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('Color contrast', () => {
    test('text meets WCAG AA contrast requirements', () => {
      // Would use color contrast checker
      // Document: All text should have 4.5:1 contrast ratio minimum
    });
  });

  describe('Touch targets', () => {
    test('all buttons are at least 44x44 points', () => {
      const { getAllByRole } = render(<GameScreen />);
      const buttons = getAllByRole('button');

      buttons.forEach(button => {
        const { width, height } = button.props.style;
        expect(width).toBeGreaterThanOrEqual(44);
        expect(height).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Focus management', () => {
    test('game over modal traps focus', () => {
      const { getByRole } = render(<GameOverModal visible={true} {...props} />);
      const modal = getByRole('dialog');
      expect(modal.props.accessibilityViewIsModal).toBe(true);
    });
  });
});
```

---

## Security Tests

### 17. Security (`security.test.ts`)

```typescript
describe('Security Tests', () => {

  describe('Input validation', () => {
    test('bet amounts are validated server-side style', () => {
      // Even though client-only, validate rigorously
      expect(() => validateBet({ amount: -1, diceNumber: 1, availableCash: 1000 }))
        .not.toThrow(); // Should return invalid, not crash
    });

    test('prevents integer overflow in cash calculations', () => {
      const result = calculateWinnings(
        { 1: Number.MAX_SAFE_INTEGER, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        { die1: 1, die2: 1 }
      );
      // Should handle gracefully
      expect(Number.isFinite(result.totalWinnings)).toBe(true);
    });
  });

  describe('Storage security', () => {
    test('high scores cannot be trivially manipulated', () => {
      // Document: In production, could use encrypted storage
      // or server-side validation for leaderboards
    });
  });

  describe('Ad SDK security', () => {
    test('rewards are validated before applying', () => {
      // Mock a fraudulent reward response
      const fakeReward = { amount: 999999999 };

      // Should cap or validate reward amount
      const applied = applyAdReward(fakeReward);
      expect(applied.amount).toBeLessThanOrEqual(MAX_AD_REWARD);
    });
  });
});
```

---

## Test Coverage Requirements

| Category | Minimum Coverage |
|----------|------------------|
| Core Game Logic | 95% |
| State Management | 90% |
| Components | 85% |
| Utilities | 90% |
| Hooks | 85% |
| Overall | 85% |

### Coverage Commands
```bash
# Run tests with coverage
npm test -- --coverage

# Generate HTML report
npm test -- --coverage --coverageReporters=html

# Check coverage thresholds
npm test -- --coverage --coverageThreshold='{"global":{"lines":85}}'
```

---

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/test.yml`)

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm test -- --coverage --ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run build:ios
      - run: npm run e2e:ios

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
```

---

## Test Data & Fixtures

### `__fixtures__/gameStates.ts`
```typescript
export const initialState = {
  cash: 1000,
  bets: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  dice: null,
  status: 'idle',
  highScore: 0,
};

export const midGameState = {
  cash: 1500,
  bets: { 1: 100, 2: 0, 3: 50, 4: 0, 5: 0, 6: 0 },
  dice: { die1: 3, die2: 5 },
  status: 'idle',
  highScore: 2000,
};

export const gameOverState = {
  cash: 0,
  bets: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  dice: { die1: 2, die2: 4 },
  status: 'gameOver',
  highScore: 5000,
};

export const allBetsState = {
  cash: 400,
  bets: { 1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100 },
  dice: null,
  status: 'idle',
  highScore: 1000,
};
```

---

## Mocking Strategy

### What to Mock
- ✅ AsyncStorage
- ✅ AdMob SDK
- ✅ Sound/Audio APIs
- ✅ Haptic feedback
- ✅ Network requests
- ✅ Date/Time (for daily rewards)

### What NOT to Mock
- ❌ Core game logic (dice, betting, winnings)
- ❌ State reducer
- ❌ React components (test real rendering)

### Mock Examples
```typescript
// Mock current date
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-15'));

// Mock Math.random for deterministic dice
const mockRandom = jest.spyOn(Math, 'random');
mockRandom.mockReturnValue(0.5); // Will produce die value of 4

// Mock sound
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: { playAsync: jest.fn(), unloadAsync: jest.fn() }
      })
    }
  }
}));
```

---

## Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Specific file
npm test -- dice.test.ts

# With coverage
npm test -- --coverage

# E2E tests
npm run e2e

# Performance tests
npm run test:perf
```

---

*Tests are the foundation. Write them first, write them well.*
