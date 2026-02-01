/**
 * Game State Tests
 * TDD: These tests are written BEFORE implementation
 */

import {
  createInitialState,
  gameReducer,
  GameState,
  GameStatus,
  isGameOver,
  canPlaceBet,
} from '../../state/gameState';
import { Bets } from '../../utils/betting';

describe('Game State Module', () => {
  const STARTING_CASH = 1000;

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

    test('initializes high score to 0 by default', () => {
      const state = createInitialState();
      expect(state.highScore).toBe(0);
    });

    test('allows setting initial high score', () => {
      const state = createInitialState({ savedHighScore: 5000 });
      expect(state.highScore).toBe(5000);
    });

    test('initializes lastWin to 0', () => {
      const state = createInitialState();
      expect(state.lastWin).toBe(0);
    });

    test('initializes isNewHighScore to false', () => {
      const state = createInitialState();
      expect(state.isNewHighScore).toBe(false);
    });
  });

  describe('gameReducer - PLACE_BET', () => {
    test('updates bet for specific dice number', () => {
      const state = createInitialState();
      const newState = gameReducer(state, {
        type: 'PLACE_BET',
        payload: { diceNumber: 3, amount: 100 },
      });
      expect(newState.bets[3]).toBe(100);
    });

    test('does not modify other bets', () => {
      const state = createInitialState();
      state.bets[1] = 50;
      const newState = gameReducer(state, {
        type: 'PLACE_BET',
        payload: { diceNumber: 3, amount: 100 },
      });
      expect(newState.bets[1]).toBe(50);
    });

    test('does not mutate original state', () => {
      const state = createInitialState();
      const newState = gameReducer(state, {
        type: 'PLACE_BET',
        payload: { diceNumber: 3, amount: 100 },
      });
      expect(state.bets[3]).toBe(0);
      expect(newState).not.toBe(state);
    });
  });

  describe('gameReducer - INCREMENT_BET', () => {
    test('adds increment to existing bet', () => {
      const state = createInitialState();
      state.bets[3] = 50;
      const newState = gameReducer(state, {
        type: 'INCREMENT_BET',
        payload: { diceNumber: 3, increment: 100 },
      });
      expect(newState.bets[3]).toBe(150);
    });

    test('does not exceed available cash', () => {
      const state = createInitialState();
      state.cash = 200;
      state.bets[3] = 150;
      const newState = gameReducer(state, {
        type: 'INCREMENT_BET',
        payload: { diceNumber: 3, increment: 100 },
      });
      // Should cap at available cash
      expect(newState.bets[3]).toBe(200);
    });

    test('considers other bets when capping', () => {
      const state = createInitialState();
      state.cash = 300;
      state.bets[1] = 100;
      state.bets[3] = 100;
      const newState = gameReducer(state, {
        type: 'INCREMENT_BET',
        payload: { diceNumber: 3, increment: 200 },
      });
      // Max available for dice 3 is 300 - 100 (bet on 1) = 200
      expect(newState.bets[3]).toBe(200);
    });
  });

  describe('gameReducer - CLEAR_BETS', () => {
    test('resets all bets to zero', () => {
      const state = createInitialState();
      state.bets = { 1: 100, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600 };
      const newState = gameReducer(state, { type: 'CLEAR_BETS' });
      expect(newState.bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });

    test('does not affect cash', () => {
      const state = createInitialState();
      state.cash = 500;
      state.bets = { 1: 100, 2: 200, 3: 0, 4: 0, 5: 0, 6: 0 };
      const newState = gameReducer(state, { type: 'CLEAR_BETS' });
      expect(newState.cash).toBe(500);
    });
  });

  describe('gameReducer - ROLL_DICE', () => {
    test('sets status to rolling', () => {
      const state = createInitialState();
      state.bets[1] = 100;
      const newState = gameReducer(state, { type: 'ROLL_DICE' });
      expect(newState.status).toBe('rolling');
    });

    test('deducts bet amount from cash', () => {
      const state = createInitialState();
      state.bets[1] = 100;
      state.bets[3] = 50;
      const newState = gameReducer(state, { type: 'ROLL_DICE' });
      expect(newState.cash).toBe(850); // 1000 - 150
    });

    test('sets error if no bets placed', () => {
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
        payload: { die1: 3, die2: 5 },
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
        payload: { die1: 3, die2: 5 },
      });

      expect(newState.cash).toBe(1100); // 900 + 200 winnings
      expect(newState.lastWin).toBe(200);
    });

    test('handles loss (no winnings)', () => {
      const state = createInitialState();
      state.bets[1] = 100;
      state.cash = 900; // Already deducted bet
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 3, die2: 5 },
      });

      expect(newState.cash).toBe(900); // No change
      expect(newState.lastWin).toBe(0);
    });

    test('updates high score if current cash exceeds it', () => {
      const state = createInitialState();
      state.highScore = 1000;
      state.cash = 1400;
      state.bets[3] = 100;
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 3, die2: 5 },
      });

      // 1400 + 200 = 1600 > 1000
      expect(newState.highScore).toBe(1600);
    });

    test('sets isNewHighScore to true when high score is beaten', () => {
      const state = createInitialState();
      state.highScore = 1000;
      state.cash = 1400;
      state.bets[3] = 100;
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 3, die2: 5 },
      });

      expect(newState.isNewHighScore).toBe(true);
    });

    test('does not update high score if cash is lower', () => {
      const state = createInitialState();
      state.highScore = 5000;
      state.cash = 900;
      state.bets[1] = 100;
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 3, die2: 5 },
      });

      expect(newState.highScore).toBe(5000);
    });

    test('sets isNewHighScore to false when high score is not beaten', () => {
      const state = createInitialState();
      state.highScore = 5000;
      state.cash = 900;
      state.bets[1] = 100;
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 3, die2: 5 },
      });

      expect(newState.isNewHighScore).toBe(false);
    });

    test('triggers game over when cash reaches zero', () => {
      const state = createInitialState();
      state.cash = 0;
      state.bets[3] = 100; // Bet was placed before
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 1, die2: 2 }, // No win
      });

      expect(newState.status).toBe('gameOver');
    });

    test('clears bets after result', () => {
      const state = createInitialState();
      state.bets = { 1: 100, 2: 50, 3: 25, 4: 0, 5: 0, 6: 0 };
      state.cash = 825;
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 1, die2: 2 },
      });

      expect(newState.bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });

    test('sets status to idle after result (if not game over)', () => {
      const state = createInitialState();
      state.bets[1] = 100;
      state.cash = 900;
      state.status = 'rolling';

      const newState = gameReducer(state, {
        type: 'DICE_RESULT',
        payload: { die1: 1, die2: 2 },
      });

      expect(newState.status).toBe('idle');
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

    test('clears dice', () => {
      const state = createInitialState();
      state.dice = { die1: 3, die2: 5 };

      const newState = gameReducer(state, { type: 'NEW_GAME' });
      expect(newState.dice).toBeNull();
    });

    test('clears bets', () => {
      const state = createInitialState();
      state.bets = { 1: 100, 2: 50, 3: 0, 4: 0, 5: 0, 6: 0 };

      const newState = gameReducer(state, { type: 'NEW_GAME' });
      expect(newState.bets).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    });

    test('sets status to idle', () => {
      const state = createInitialState();
      state.status = 'gameOver';

      const newState = gameReducer(state, { type: 'NEW_GAME' });
      expect(newState.status).toBe('idle');
    });

    test('resets lastWin to 0', () => {
      const state = createInitialState();
      state.lastWin = 500;

      const newState = gameReducer(state, { type: 'NEW_GAME' });
      expect(newState.lastWin).toBe(0);
    });

    test('clears error', () => {
      const state = createInitialState();
      state.error = 'SOME_ERROR';

      const newState = gameReducer(state, { type: 'NEW_GAME' });
      expect(newState.error).toBeUndefined();
    });

    test('resets isNewHighScore to false', () => {
      const state = createInitialState();
      state.isNewHighScore = true;

      const newState = gameReducer(state, { type: 'NEW_GAME' });
      expect(newState.isNewHighScore).toBe(false);
    });
  });

  describe('gameReducer - ADD_CASH', () => {
    test('adds cash to current amount', () => {
      const state = createInitialState();
      state.cash = 500;

      const newState = gameReducer(state, {
        type: 'ADD_CASH',
        payload: { amount: 200 },
      });
      expect(newState.cash).toBe(700);
    });

    test('works when cash is zero (ad revival)', () => {
      const state = createInitialState();
      state.cash = 0;
      state.status = 'gameOver';

      const newState = gameReducer(state, {
        type: 'ADD_CASH',
        payload: { amount: 500 },
      });
      expect(newState.cash).toBe(500);
      expect(newState.status).toBe('idle');
    });
  });

  describe('isGameOver', () => {
    test('returns true when cash is 0', () => {
      const state: GameState = {
        ...createInitialState(),
        cash: 0,
        status: 'idle',
      };
      expect(isGameOver(state)).toBe(true);
    });

    test('returns true when status is gameOver', () => {
      const state: GameState = {
        ...createInitialState(),
        cash: 100,
        status: 'gameOver',
      };
      expect(isGameOver(state)).toBe(true);
    });

    test('returns false when cash is positive and status is not gameOver', () => {
      const state: GameState = {
        ...createInitialState(),
        cash: 100,
        status: 'idle',
      };
      expect(isGameOver(state)).toBe(false);
    });
  });

  describe('canPlaceBet', () => {
    test('returns true during idle status with cash', () => {
      const state: GameState = {
        ...createInitialState(),
        cash: 1000,
        status: 'idle',
      };
      expect(canPlaceBet(state)).toBe(true);
    });

    test('returns false during rolling', () => {
      const state: GameState = {
        ...createInitialState(),
        cash: 1000,
        status: 'rolling',
      };
      expect(canPlaceBet(state)).toBe(false);
    });

    test('returns false during gameOver', () => {
      const state: GameState = {
        ...createInitialState(),
        cash: 0,
        status: 'gameOver',
      };
      expect(canPlaceBet(state)).toBe(false);
    });

    test('returns false when cash is 0', () => {
      const state: GameState = {
        ...createInitialState(),
        cash: 0,
        status: 'idle',
      };
      expect(canPlaceBet(state)).toBe(false);
    });
  });
});
