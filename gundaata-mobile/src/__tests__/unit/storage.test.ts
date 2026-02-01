/**
 * Storage Service Tests
 * TDD: Tests written BEFORE implementation
 */

import { storageService, STORAGE_KEYS } from '../../services/storage';

// Mock AsyncStorage
const mockStore: Record<string, string> = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn((key: string) => {
      return Promise.resolve(mockStore[key] ?? null);
    }),
    setItem: jest.fn((key: string, value: string) => {
      mockStore[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      delete mockStore[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(mockStore).forEach(key => delete mockStore[key]);
      return Promise.resolve();
    }),
  },
}));

describe('Storage Service', () => {
  beforeEach(() => {
    // Clear mock store
    Object.keys(mockStore).forEach(key => delete mockStore[key]);
    jest.clearAllMocks();
  });

  describe('STORAGE_KEYS', () => {
    test('has HIGH_SCORE key', () => {
      expect(STORAGE_KEYS.HIGH_SCORE).toBeDefined();
      expect(typeof STORAGE_KEYS.HIGH_SCORE).toBe('string');
    });

    test('has GAME_STATE key', () => {
      expect(STORAGE_KEYS.GAME_STATE).toBeDefined();
      expect(typeof STORAGE_KEYS.GAME_STATE).toBe('string');
    });
  });

  describe('saveHighScore', () => {
    test('saves high score as string', async () => {
      await storageService.saveHighScore(5000);
      expect(mockStore[STORAGE_KEYS.HIGH_SCORE]).toBe('5000');
    });

    test('overwrites previous high score', async () => {
      await storageService.saveHighScore(1000);
      await storageService.saveHighScore(5000);
      expect(mockStore[STORAGE_KEYS.HIGH_SCORE]).toBe('5000');
    });

    test('handles zero', async () => {
      await storageService.saveHighScore(0);
      expect(mockStore[STORAGE_KEYS.HIGH_SCORE]).toBe('0');
    });
  });

  describe('loadHighScore', () => {
    test('returns saved high score', async () => {
      mockStore[STORAGE_KEYS.HIGH_SCORE] = '5000';
      const result = await storageService.loadHighScore();
      expect(result).toBe(5000);
    });

    test('returns 0 when no saved high score', async () => {
      const result = await storageService.loadHighScore();
      expect(result).toBe(0);
    });

    test('returns 0 for invalid stored value', async () => {
      mockStore[STORAGE_KEYS.HIGH_SCORE] = 'not-a-number';
      const result = await storageService.loadHighScore();
      expect(result).toBe(0);
    });

    test('returns 0 when AsyncStorage throws', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));
      const result = await storageService.loadHighScore();
      expect(result).toBe(0);
    });
  });

  describe('saveGameState', () => {
    test('saves game state as JSON', async () => {
      const state = { cash: 500, highScore: 2000 };
      await storageService.saveGameState(state);
      const stored = JSON.parse(mockStore[STORAGE_KEYS.GAME_STATE]);
      expect(stored.cash).toBe(500);
      expect(stored.highScore).toBe(2000);
    });

    test('saves complete game state fields', async () => {
      const state = {
        cash: 750,
        highScore: 3000,
        bets: { 1: 0, 2: 0, 3: 100, 4: 0, 5: 0, 6: 0 },
      };
      await storageService.saveGameState(state);
      const stored = JSON.parse(mockStore[STORAGE_KEYS.GAME_STATE]);
      expect(stored.cash).toBe(750);
      expect(stored.bets).toEqual({ 1: 0, 2: 0, 3: 100, 4: 0, 5: 0, 6: 0 });
    });
  });

  describe('loadGameState', () => {
    test('returns saved game state', async () => {
      mockStore[STORAGE_KEYS.GAME_STATE] = JSON.stringify({
        cash: 500,
        highScore: 2000,
      });
      const result = await storageService.loadGameState();
      expect(result).toEqual({ cash: 500, highScore: 2000 });
    });

    test('returns null when no saved state', async () => {
      const result = await storageService.loadGameState();
      expect(result).toBeNull();
    });

    test('returns null for corrupted JSON', async () => {
      mockStore[STORAGE_KEYS.GAME_STATE] = '{invalid json';
      const result = await storageService.loadGameState();
      expect(result).toBeNull();
    });

    test('returns null when AsyncStorage throws', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));
      const result = await storageService.loadGameState();
      expect(result).toBeNull();
    });
  });

  describe('clearGameState', () => {
    test('removes saved game state', async () => {
      mockStore[STORAGE_KEYS.GAME_STATE] = JSON.stringify({ cash: 500 });
      await storageService.clearGameState();
      expect(mockStore[STORAGE_KEYS.GAME_STATE]).toBeUndefined();
    });

    test('does not affect high score', async () => {
      mockStore[STORAGE_KEYS.HIGH_SCORE] = '5000';
      mockStore[STORAGE_KEYS.GAME_STATE] = JSON.stringify({ cash: 500 });
      await storageService.clearGameState();
      expect(mockStore[STORAGE_KEYS.HIGH_SCORE]).toBe('5000');
    });
  });

  describe('clearAll', () => {
    test('removes all stored data', async () => {
      mockStore[STORAGE_KEYS.HIGH_SCORE] = '5000';
      mockStore[STORAGE_KEYS.GAME_STATE] = JSON.stringify({ cash: 500 });
      await storageService.clearAll();
      expect(mockStore[STORAGE_KEYS.HIGH_SCORE]).toBeUndefined();
      expect(mockStore[STORAGE_KEYS.GAME_STATE]).toBeUndefined();
    });
  });
});
