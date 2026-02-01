/**
 * Storage Service
 * Wraps AsyncStorage for persisting high score and game state
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  HIGH_SCORE: '@gundaata/highScore',
  GAME_STATE: '@gundaata/gameState',
} as const;

export const storageService = {
  async saveHighScore(score: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(score));
    } catch (e) {
      console.warn('Failed to save high score:', e);
    }
  },

  async loadHighScore(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      if (value === null) return 0;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    } catch (e) {
      console.warn('Failed to load high score:', e);
      return 0;
    }
  },

  async saveGameState(state: Record<string, unknown>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save game state:', e);
    }
  },

  async loadGameState(): Promise<Record<string, unknown> | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (value === null) return null;
      return JSON.parse(value);
    } catch (e) {
      console.warn('Failed to load game state:', e);
      return null;
    }
  },

  async clearGameState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    } catch (e) {
      console.warn('Failed to clear game state:', e);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
      await AsyncStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
  },
};
