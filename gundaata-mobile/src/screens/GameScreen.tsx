/**
 * GameScreen
 * Main game screen with authentic gundaata board layout.
 * Top-down view of the betting board with dice in the center.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../hooks/useGameStore';
import { useAds } from '../hooks/useAds';
import { BettingBoard } from '../components/BettingBoard';
import { ChipSelector } from '../components/ChipSelector';
import { GameOverModal } from '../components/GameOverModal';
import { DiceNumber } from '../utils/betting';
import { rollDice as rollDiceLogic } from '../utils/dice';

const ROLL_ANIMATION_DURATION = 1000;
const USE_MOCK_ADS = __DEV__;

export function GameScreen() {
  const {
    cash,
    bets,
    dice,
    status,
    highScore,
    lastWin,
    isNewHighScore,
    totalBet,
    canRoll,
    incrementBet,
    clearBets,
    rollDice,
    setDiceResult,
    newGame,
    addCash,
    loadSavedState,
  } = useGameStore();

  // Load persisted high score on mount
  useEffect(() => {
    loadSavedState();
  }, []);

  // Ad integration
  const {
    isRewardedAdReady,
    showRewardedAd,
  } = useAds({ mockMode: USE_MOCK_ADS });

  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedChip, setSelectedChip] = useState(50);
  const gameOverCountRef = useRef(0);

  const handleRoll = useCallback(() => {
    if (!canRoll || isAnimating) return;

    rollDice();
    setIsAnimating(true);

    setTimeout(() => {
      const result = rollDiceLogic();
      setDiceResult(result);
      setIsAnimating(false);
    }, ROLL_ANIMATION_DURATION);
  }, [canRoll, isAnimating, rollDice, setDiceResult]);

  const handleCellPress = useCallback((diceNumber: DiceNumber) => {
    if (isAnimating) return;
    incrementBet(diceNumber, selectedChip);
  }, [isAnimating, selectedChip, incrementBet]);

  const handleWatchAd = useCallback(async () => {
    const reward = await showRewardedAd();
    if (reward) {
      addCash(reward.amount);
    }
  }, [showRewardedAd, addCash]);

  const isGameOver = status === 'gameOver';
  const isRolling = status === 'rolling' || isAnimating;
  const winningNumbers = dice ? [dice.die1, dice.die2] : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header: Title + Cash + High Score */}
      <View style={styles.header}>
        <Text style={styles.title}>Gundaata</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>CASH</Text>
            <Text style={styles.cashValue}>${cash.toLocaleString()}</Text>
          </View>
          {lastWin > 0 && (
            <View style={styles.winBadge}>
              <Text style={styles.winText}>+${lastWin.toLocaleString()}</Text>
            </View>
          )}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>HIGH</Text>
            <Text style={styles.highValue}>${highScore.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* The Board */}
      <View style={styles.boardContainer}>
        <BettingBoard
          bets={bets}
          dice={dice}
          isRolling={isRolling}
          canRoll={canRoll && !isAnimating}
          lastWin={lastWin}
          winningNumbers={winningNumbers}
          disabled={isRolling}
          onCellPress={handleCellPress}
          onRoll={handleRoll}
        />
      </View>

      {/* Chip Selector */}
      <View style={styles.bottomArea}>
        <ChipSelector
          selectedChip={selectedChip}
          onSelectChip={setSelectedChip}
          onClear={clearBets}
          disabled={isRolling}
          totalBet={totalBet}
        />
      </View>

      {/* Game Over Modal */}
      <GameOverModal
        visible={isGameOver}
        highScore={highScore}
        isNewHighScore={isNewHighScore}
        onNewGame={newGame}
        onWatchAd={handleWatchAd}
        adAvailable={isRewardedAdReady}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E2723', // Dark brown — like a wooden table
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#FFD54F',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#A1887F',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cashValue: {
    color: '#66BB6A',
    fontSize: 22,
    fontWeight: 'bold',
  },
  highValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  winBadge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bottomArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingBottom: 8,
  },
});

export default GameScreen;
