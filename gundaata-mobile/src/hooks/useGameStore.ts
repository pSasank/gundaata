/**
 * Game Store Hook
 * Zustand store connecting game state to React components
 * TDD: Stub implementation - tests should fail initially
 */

import { create } from 'zustand';
import { Bets, DiceNumber, calculateTotalBet, createEmptyBets } from '../utils/betting';
import { DiceRoll } from '../utils/dice';
import { gameReducer, createInitialState, GameState, GameStatus } from '../state/gameState';
import { storageService } from '../services/storage';

interface GameStore extends GameState {
  // Actions
  placeBet: (diceNumber: DiceNumber, amount: number) => void;
  incrementBet: (diceNumber: DiceNumber, increment: number) => void;
  clearBets: () => void;
  rollDice: () => void;
  setDiceResult: (dice: DiceRoll) => void;
  newGame: () => void;
  addCash: (amount: number) => void;
  resetStore: () => void;
  loadSavedState: () => Promise<void>;

  // Computed (derived from state)
  readonly totalBet: number;
  readonly canRoll: boolean;
}

// Helper to add computed properties
const computeValues = (state: GameState) => ({
  totalBet: calculateTotalBet(state.bets),
  canRoll: state.status === 'idle' && calculateTotalBet(state.bets) > 0,
});

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  ...createInitialState(),
  ...computeValues(createInitialState()),

  // Actions - each action updates state and recomputes derived values
  placeBet: (diceNumber, amount) => {
    set(state => {
      const newState = gameReducer(state, { type: 'PLACE_BET', payload: { diceNumber, amount } });
      return { ...newState, ...computeValues(newState) };
    });
  },

  incrementBet: (diceNumber, increment) => {
    set(state => {
      const newState = gameReducer(state, { type: 'INCREMENT_BET', payload: { diceNumber, increment } });
      return { ...newState, ...computeValues(newState) };
    });
  },

  clearBets: () => {
    set(state => {
      const newState = gameReducer(state, { type: 'CLEAR_BETS' });
      return { ...newState, ...computeValues(newState) };
    });
  },

  rollDice: () => {
    set(state => {
      const newState = gameReducer(state, { type: 'ROLL_DICE' });
      return { ...newState, ...computeValues(newState) };
    });
  },

  setDiceResult: (dice) => {
    set(state => {
      const newState = gameReducer(state, { type: 'DICE_RESULT', payload: dice });
      // Persist high score if it changed
      if (newState.highScore > state.highScore) {
        storageService.saveHighScore(newState.highScore);
      }
      return { ...newState, ...computeValues(newState) };
    });
  },

  newGame: () => {
    set(state => {
      const newState = gameReducer(state, { type: 'NEW_GAME' });
      return { ...newState, ...computeValues(newState) };
    });
  },

  addCash: (amount) => {
    set(state => {
      const newState = gameReducer(state, { type: 'ADD_CASH', payload: { amount } });
      return { ...newState, ...computeValues(newState) };
    });
  },

  resetStore: () => {
    const initial = createInitialState();
    set({ ...initial, ...computeValues(initial) });
  },

  loadSavedState: async () => {
    const highScore = await storageService.loadHighScore();
    if (highScore > 0) {
      set(state => ({
        ...state,
        highScore,
      }));
    }
  },
}));
