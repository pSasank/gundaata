/**
 * Game State Module
 * TDD: Stub implementation - tests should fail initially
 */

import { Bets, createEmptyBets, calculateTotalBet, DiceNumber } from '../utils/betting';
import { DiceRoll } from '../utils/dice';
import { calculateWinnings } from '../utils/winnings';

export type GameStatus = 'idle' | 'rolling' | 'gameOver';

export interface GameState {
  cash: number;
  bets: Bets;
  dice: DiceRoll | null;
  status: GameStatus;
  highScore: number;
  lastWin: number;
  isNewHighScore: boolean;
  error?: string;
}

export interface InitialStateOptions {
  startingCash?: number;
  savedHighScore?: number;
}

export type GameAction =
  | { type: 'PLACE_BET'; payload: { diceNumber: DiceNumber; amount: number } }
  | { type: 'INCREMENT_BET'; payload: { diceNumber: DiceNumber; increment: number } }
  | { type: 'CLEAR_BETS' }
  | { type: 'ROLL_DICE' }
  | { type: 'DICE_RESULT'; payload: DiceRoll }
  | { type: 'NEW_GAME' }
  | { type: 'ADD_CASH'; payload: { amount: number } };

const DEFAULT_STARTING_CASH = 1000;

/**
 * Creates the initial game state
 */
export function createInitialState(options: InitialStateOptions = {}): GameState {
  const { startingCash = DEFAULT_STARTING_CASH, savedHighScore = 0 } = options;
  return {
    cash: startingCash,
    bets: createEmptyBets(),
    dice: null,
    status: 'idle',
    highScore: savedHighScore,
    lastWin: 0,
    isNewHighScore: false,
  };
}

/**
 * Game state reducer
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLACE_BET': {
      const { diceNumber, amount } = action.payload;
      return {
        ...state,
        bets: { ...state.bets, [diceNumber]: amount },
      };
    }

    case 'INCREMENT_BET': {
      const { diceNumber, increment } = action.payload;
      const currentBet = state.bets[diceNumber];
      const otherBetsTotal = calculateTotalBet(state.bets) - currentBet;
      const maxBet = state.cash - otherBetsTotal;
      const newBet = Math.min(currentBet + increment, maxBet);
      return {
        ...state,
        bets: { ...state.bets, [diceNumber]: newBet },
      };
    }

    case 'CLEAR_BETS': {
      return {
        ...state,
        bets: createEmptyBets(),
      };
    }

    case 'ROLL_DICE': {
      const totalBet = calculateTotalBet(state.bets);
      if (totalBet === 0) {
        return {
          ...state,
          error: 'NO_BETS_PLACED',
        };
      }
      return {
        ...state,
        status: 'rolling',
        cash: state.cash - totalBet,
        error: undefined,
      };
    }

    case 'DICE_RESULT': {
      const dice = action.payload;
      const result = calculateWinnings(state.bets, dice);
      const newCash = state.cash + result.totalWinnings;
      const newHighScore = Math.max(state.highScore, newCash);
      const isOver = newCash === 0;

      return {
        ...state,
        dice,
        cash: newCash,
        lastWin: result.totalWinnings,
        highScore: newHighScore,
        isNewHighScore: newHighScore > state.highScore,
        bets: createEmptyBets(),
        status: isOver ? 'gameOver' : 'idle',
      };
    }

    case 'NEW_GAME': {
      return {
        ...createInitialState(),
        highScore: state.highScore,
      };
    }

    case 'ADD_CASH': {
      const { amount } = action.payload;
      return {
        ...state,
        cash: state.cash + amount,
        status: 'idle',
      };
    }

    default:
      return state;
  }
}

/**
 * Checks if the game is over
 */
export function isGameOver(state: GameState): boolean {
  return state.cash === 0 || state.status === 'gameOver';
}

/**
 * Checks if player can place a bet
 */
export function canPlaceBet(state: GameState): boolean {
  return state.status === 'idle' && state.cash > 0;
}
