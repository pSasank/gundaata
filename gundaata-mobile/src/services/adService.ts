/**
 * Ad Service
 * Handles AdMob integration for rewarded and interstitial ads
 */

import {
  RewardedAd,
  InterstitialAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Use test IDs for development, replace with real IDs for production
export const AD_UNIT_IDS = {
  BANNER: TestIds.BANNER,
  INTERSTITIAL: TestIds.INTERSTITIAL,
  REWARDED: TestIds.REWARDED,
};

export interface AdReward {
  type: 'revival';
  amount: number;
}

export class AdService {
  private rewardedAd: ReturnType<typeof RewardedAd.createForAdRequest> | null = null;
  private interstitialAd: ReturnType<typeof InterstitialAd.createForAdRequest> | null = null;
  private rewardedAdLoaded = false;
  private interstitialAdLoaded = false;
  private mockMode = false;

  // Reward amount for watching ad after game over
  public readonly REVIVAL_REWARD_AMOUNT = 500;

  constructor() {
    this.initializeAds();
  }

  private initializeAds() {
    try {
      // Initialize rewarded ad
      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.REWARDED, {
        requestNonPersonalizedAdsOnly: true,
      });

      // Initialize interstitial ad
      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.setupRewardedAdListeners();
      this.setupInterstitialAdListeners();
    } catch (error) {
      console.warn('AdService: Failed to initialize ads', error);
    }
  }

  private setupRewardedAdListeners() {
    if (!this.rewardedAd) return;

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.rewardedAdLoaded = true;
    });

    this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn('Rewarded ad error:', error);
      this.rewardedAdLoaded = false;
    });

    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.rewardedAdLoaded = false;
      // Preload next ad
      this.loadRewardedAd();
    });
  }

  private setupInterstitialAdListeners() {
    if (!this.interstitialAd) return;

    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      this.interstitialAdLoaded = true;
    });

    this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn('Interstitial ad error:', error);
      this.interstitialAdLoaded = false;
    });

    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.interstitialAdLoaded = false;
      // Preload next ad
      this.loadInterstitialAd();
    });
  }

  // ============ Rewarded Ads ============

  async loadRewardedAd(): Promise<void> {
    if (this.mockMode) return Promise.resolve();

    try {
      await this.rewardedAd?.load();
    } catch (error) {
      console.warn('Failed to load rewarded ad:', error);
    }
  }

  isRewardedAdReady(): boolean {
    if (this.mockMode) return true;
    return this.rewardedAdLoaded;
  }

  async showRewardedAd(): Promise<AdReward | null> {
    // Mock mode for testing without real ads
    if (this.mockMode) {
      return {
        type: 'revival',
        amount: this.REVIVAL_REWARD_AMOUNT,
      };
    }

    if (!this.rewardedAdLoaded || !this.rewardedAd) {
      return null;
    }

    return new Promise((resolve) => {
      let rewarded = false;

      // Listen for reward earned
      const rewardListener = this.rewardedAd!.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          rewarded = true;
        }
      );

      // Listen for ad closed
      const closeListener = this.rewardedAd!.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          rewardListener();
          closeListener();

          if (rewarded) {
            resolve({
              type: 'revival',
              amount: this.REVIVAL_REWARD_AMOUNT,
            });
          } else {
            resolve(null);
          }
        }
      );

      // Show the ad
      this.rewardedAd!.show();
    });
  }

  // ============ Interstitial Ads ============

  async loadInterstitialAd(): Promise<void> {
    if (this.mockMode) return Promise.resolve();

    try {
      await this.interstitialAd?.load();
    } catch (error) {
      console.warn('Failed to load interstitial ad:', error);
    }
  }

  isInterstitialAdReady(): boolean {
    if (this.mockMode) return true;
    return this.interstitialAdLoaded;
  }

  async showInterstitialAd(): Promise<void> {
    if (this.mockMode) return Promise.resolve();

    if (!this.interstitialAdLoaded || !this.interstitialAd) {
      return;
    }

    return new Promise((resolve) => {
      const closeListener = this.interstitialAd!.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          closeListener();
          resolve();
        }
      );

      this.interstitialAd!.show();
    });
  }

  // ============ Game Over Logic ============

  /**
   * Determines if interstitial should show based on game over count
   * Shows every 3rd game over to avoid being too aggressive
   */
  shouldShowInterstitial(gameOverCount: number): boolean {
    return gameOverCount > 0 && gameOverCount % 3 === 0;
  }

  // ============ Mock Mode ============

  setMockMode(enabled: boolean): void {
    this.mockMode = enabled;
  }

  isMockMode(): boolean {
    return this.mockMode;
  }
}

// Singleton instance
let adServiceInstance: AdService | null = null;

export function getAdService(): AdService {
  if (!adServiceInstance) {
    adServiceInstance = new AdService();
  }
  return adServiceInstance;
}

export default AdService;
