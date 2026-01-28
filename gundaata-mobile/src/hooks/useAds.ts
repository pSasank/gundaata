/**
 * useAds Hook
 * React hook for managing ads in components
 */

import { useState, useEffect, useCallback } from 'react';
import { getAdService, AdReward } from '../services/adService';

interface UseAdsOptions {
  /** Enable mock mode for testing without real ads */
  mockMode?: boolean;
}

interface UseAdsReturn {
  /** Whether rewarded ad is ready to show */
  isRewardedAdReady: boolean;
  /** Show rewarded ad and return reward if completed */
  showRewardedAd: () => Promise<AdReward | null>;
  /** Whether interstitial ad is ready */
  isInterstitialAdReady: boolean;
  /** Show interstitial ad */
  showInterstitialAd: () => Promise<void>;
  /** Check if should show interstitial based on game over count */
  shouldShowInterstitial: (gameOverCount: number) => boolean;
  /** Reward amount for revival */
  revivalRewardAmount: number;
  /** Loading state */
  isLoading: boolean;
}

export function useAds(options: UseAdsOptions = {}): UseAdsReturn {
  const { mockMode = false } = options;
  const [isRewardedAdReady, setIsRewardedAdReady] = useState(false);
  const [isInterstitialAdReady, setIsInterstitialAdReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const adService = getAdService();

  useEffect(() => {
    // Set mock mode if specified
    if (mockMode) {
      adService.setMockMode(true);
    }

    // Load ads on mount
    const loadAds = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          adService.loadRewardedAd(),
          adService.loadInterstitialAd(),
        ]);
      } catch (error) {
        console.warn('Failed to load ads:', error);
      } finally {
        setIsLoading(false);
        setIsRewardedAdReady(adService.isRewardedAdReady());
        setIsInterstitialAdReady(adService.isInterstitialAdReady());
      }
    };

    loadAds();

    // Poll for ad ready status
    const interval = setInterval(() => {
      setIsRewardedAdReady(adService.isRewardedAdReady());
      setIsInterstitialAdReady(adService.isInterstitialAdReady());
    }, 1000);

    return () => clearInterval(interval);
  }, [mockMode]);

  const showRewardedAd = useCallback(async (): Promise<AdReward | null> => {
    const reward = await adService.showRewardedAd();
    // Refresh ready state after showing
    setIsRewardedAdReady(adService.isRewardedAdReady());
    return reward;
  }, []);

  const showInterstitialAd = useCallback(async (): Promise<void> => {
    await adService.showInterstitialAd();
    // Refresh ready state after showing
    setIsInterstitialAdReady(adService.isInterstitialAdReady());
  }, []);

  const shouldShowInterstitial = useCallback((gameOverCount: number): boolean => {
    return adService.shouldShowInterstitial(gameOverCount);
  }, []);

  return {
    isRewardedAdReady,
    showRewardedAd,
    isInterstitialAdReady,
    showInterstitialAd,
    shouldShowInterstitial,
    revivalRewardAmount: adService.REVIVAL_REWARD_AMOUNT,
    isLoading,
  };
}

export default useAds;
