/**
 * Ad Service
 * Handles AdMob integration for rewarded and interstitial ads.
 * Gracefully falls back to mock mode when native module is unavailable
 * (e.g., running in Expo Go instead of a development build).
 */

// Lazy-loaded native module references
let RNAdMob: typeof import('react-native-google-mobile-ads') | null = null;
let nativeModuleAvailable = false;

// Try to load the native module - will fail in Expo Go
try {
  RNAdMob = require('react-native-google-mobile-ads');
  nativeModuleAvailable = true;
} catch (e) {
  console.warn('AdService: Native ad module not available (Expo Go?). Using mock mode.');
  nativeModuleAvailable = false;
}

// Ad unit IDs - test IDs for development
export const AD_UNIT_IDS = nativeModuleAvailable
  ? {
      BANNER: RNAdMob!.TestIds.BANNER,
      INTERSTITIAL: RNAdMob!.TestIds.INTERSTITIAL,
      REWARDED: RNAdMob!.TestIds.REWARDED,
    }
  : {
      BANNER: 'mock-banner-id',
      INTERSTITIAL: 'mock-interstitial-id',
      REWARDED: 'mock-rewarded-id',
    };

export interface AdReward {
  type: 'revival';
  amount: number;
}

export class AdService {
  private rewardedAd: any = null;
  private interstitialAd: any = null;
  private rewardedAdLoaded = false;
  private interstitialAdLoaded = false;
  private mockMode = false;

  // Reward amount for watching ad after game over
  public readonly REVIVAL_REWARD_AMOUNT = 500;

  constructor() {
    // Auto-enable mock mode if native module isn't available
    if (!nativeModuleAvailable) {
      this.mockMode = true;
    } else {
      this.initializeAds();
    }
  }

  private initializeAds() {
    if (!RNAdMob) return;

    try {
      const { RewardedAd, InterstitialAd } = RNAdMob;

      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.REWARDED, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.setupRewardedAdListeners();
      this.setupInterstitialAdListeners();
    } catch (error) {
      console.warn('AdService: Failed to initialize ads, using mock mode', error);
      this.mockMode = true;
    }
  }

  private setupRewardedAdListeners() {
    if (!this.rewardedAd || !RNAdMob) return;

    const { RewardedAdEventType, AdEventType } = RNAdMob;

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.rewardedAdLoaded = true;
    });

    this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
      console.warn('Rewarded ad error:', error);
      this.rewardedAdLoaded = false;
    });

    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.rewardedAdLoaded = false;
      this.loadRewardedAd();
    });
  }

  private setupInterstitialAdListeners() {
    if (!this.interstitialAd || !RNAdMob) return;

    const { AdEventType } = RNAdMob;

    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      this.interstitialAdLoaded = true;
    });

    this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
      console.warn('Interstitial ad error:', error);
      this.interstitialAdLoaded = false;
    });

    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.interstitialAdLoaded = false;
      this.loadInterstitialAd();
    });
  }

  // ============ Rewarded Ads ============

  async loadRewardedAd(): Promise<void> {
    if (this.mockMode) return;

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
    if (this.mockMode) {
      return {
        type: 'revival',
        amount: this.REVIVAL_REWARD_AMOUNT,
      };
    }

    if (!this.rewardedAdLoaded || !this.rewardedAd || !RNAdMob) {
      return null;
    }

    const { RewardedAdEventType, AdEventType } = RNAdMob;

    return new Promise((resolve) => {
      let rewarded = false;

      const rewardListener = this.rewardedAd!.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          rewarded = true;
        }
      );

      const closeListener = this.rewardedAd!.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          rewardListener();
          closeListener();

          if (rewarded) {
            resolve({ type: 'revival', amount: this.REVIVAL_REWARD_AMOUNT });
          } else {
            resolve(null);
          }
        }
      );

      this.rewardedAd!.show();
    });
  }

  // ============ Interstitial Ads ============

  async loadInterstitialAd(): Promise<void> {
    if (this.mockMode) return;

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
    if (this.mockMode) return;

    if (!this.interstitialAdLoaded || !this.interstitialAd || !RNAdMob) {
      return;
    }

    const { AdEventType } = RNAdMob;

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

  isNativeModuleAvailable(): boolean {
    return nativeModuleAvailable;
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
