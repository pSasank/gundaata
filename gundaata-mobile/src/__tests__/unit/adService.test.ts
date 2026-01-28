/**
 * Ad Service Tests
 * Tests for AdMob integration service
 */

import {
  AdService,
  AD_UNIT_IDS,
  AdReward,
} from '../../services/adService';

// Mock the react-native-google-mobile-ads module
jest.mock('react-native-google-mobile-ads', () => ({
  RewardedAd: {
    createForAdRequest: jest.fn(() => ({
      load: jest.fn(),
      show: jest.fn(),
      addAdEventListener: jest.fn(),
    })),
  },
  InterstitialAd: {
    createForAdRequest: jest.fn(() => ({
      load: jest.fn(),
      show: jest.fn(),
      addAdEventListener: jest.fn(),
    })),
  },
  BannerAd: jest.fn(),
  BannerAdSize: {
    BANNER: 'BANNER',
    FULL_BANNER: 'FULL_BANNER',
  },
  AdEventType: {
    LOADED: 'loaded',
    ERROR: 'error',
    CLOSED: 'closed',
  },
  RewardedAdEventType: {
    LOADED: 'loaded',
    EARNED_REWARD: 'earned_reward',
  },
  TestIds: {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
    REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  },
}));

describe('AdService', () => {
  let adService: AdService;

  beforeEach(() => {
    adService = new AdService();
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    test('initializes without error', () => {
      expect(() => new AdService()).not.toThrow();
    });

    test('uses test ad IDs in development', () => {
      expect(AD_UNIT_IDS.REWARDED).toBeDefined();
      expect(AD_UNIT_IDS.INTERSTITIAL).toBeDefined();
      expect(AD_UNIT_IDS.BANNER).toBeDefined();
    });
  });

  describe('rewarded ads', () => {
    test('loadRewardedAd returns promise', async () => {
      const result = adService.loadRewardedAd();
      expect(result).toBeInstanceOf(Promise);
    });

    test('isRewardedAdReady returns boolean', () => {
      const ready = adService.isRewardedAdReady();
      expect(typeof ready).toBe('boolean');
    });

    test('showRewardedAd returns promise with reward or null', async () => {
      // Mock ad as loaded
      adService['rewardedAdLoaded'] = true;

      const result = adService.showRewardedAd();
      expect(result).toBeInstanceOf(Promise);
    });

    test('showRewardedAd returns null if ad not ready', async () => {
      adService['rewardedAdLoaded'] = false;
      const result = await adService.showRewardedAd();
      expect(result).toBeNull();
    });
  });

  describe('interstitial ads', () => {
    test('loadInterstitialAd returns promise', async () => {
      const result = adService.loadInterstitialAd();
      expect(result).toBeInstanceOf(Promise);
    });

    test('isInterstitialAdReady returns boolean', () => {
      const ready = adService.isInterstitialAdReady();
      expect(typeof ready).toBe('boolean');
    });

    test('showInterstitialAd returns promise', async () => {
      const result = adService.showInterstitialAd();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('game over ad logic', () => {
    test('shouldShowInterstitial returns false for first 2 game overs', () => {
      expect(adService.shouldShowInterstitial(1)).toBe(false);
      expect(adService.shouldShowInterstitial(2)).toBe(false);
    });

    test('shouldShowInterstitial returns true every 3rd game over', () => {
      expect(adService.shouldShowInterstitial(3)).toBe(true);
      expect(adService.shouldShowInterstitial(6)).toBe(true);
      expect(adService.shouldShowInterstitial(9)).toBe(true);
    });

    test('shouldShowInterstitial returns false between 3rd intervals', () => {
      expect(adService.shouldShowInterstitial(4)).toBe(false);
      expect(adService.shouldShowInterstitial(5)).toBe(false);
      expect(adService.shouldShowInterstitial(7)).toBe(false);
    });
  });

  describe('reward configuration', () => {
    test('REVIVAL_REWARD_AMOUNT is 500', () => {
      expect(adService.REVIVAL_REWARD_AMOUNT).toBe(500);
    });
  });

  describe('mock mode for testing', () => {
    test('setMockMode enables mock rewards', () => {
      adService.setMockMode(true);
      expect(adService.isMockMode()).toBe(true);
    });

    test('mock mode showRewardedAd returns simulated reward', async () => {
      adService.setMockMode(true);
      const reward = await adService.showRewardedAd();
      expect(reward).toEqual({
        type: 'revival',
        amount: 500,
      });
    });
  });
});
