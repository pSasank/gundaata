/**
 * GameScreen
 * Main game screen integrating all components
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../hooks/useGameStore';
import { useAds } from '../hooks/useAds';
import { Dice } from '../components/Dice';
import { BetInput } from '../components/BetInput';
import { CashDisplay } from '../components/CashDisplay';
import { GameOverModal } from '../components/GameOverModal';
import { DiceNumber } from '../utils/betting';
import { rollDice as rollDiceLogic } from '../utils/dice';

const DICE_NUMBERS: DiceNumber[] = [1, 2, 3, 4, 5, 6];
const ROLL_ANIMATION_DURATION = 1000;

// Set to true for development testing without real ads
const USE_MOCK_ADS = __DEV__;

export function GameScreen() {
  const {
    cash,
    bets,
    dice,
    status,
    highScore,
    lastWin,
    totalBet,
    canRoll,
    placeBet,
    incrementBet,
    clearBets,
    rollDice,
    setDiceResult,
    newGame,
    addCash,
  } = useGameStore();

  // Ad integration
  const {
    isRewardedAdReady,
    showRewardedAd,
    revivalRewardAmount,
  } = useAds({ mockMode: USE_MOCK_ADS });

  const [isAnimating, setIsAnimating] = useState(false);
  const [prevHighScore] = useState(highScore);
  const gameOverCountRef = useRef(0);

  const handleRoll = useCallback(() => {
    if (!canRoll || isAnimating) return;

    // Start roll
    rollDice();
    setIsAnimating(true);

    // Animate for duration, then set result
    setTimeout(() => {
      const result = rollDiceLogic();
      setDiceResult(result);
      setIsAnimating(false);
    }, ROLL_ANIMATION_DURATION);
  }, [canRoll, isAnimating, rollDice, setDiceResult]);

  const handleWatchAd = useCallback(async () => {
    const reward = await showRewardedAd();
    if (reward) {
      addCash(reward.amount);
    }
  }, [showRewardedAd, addCash]);

  const isGameOver = status === 'gameOver';
  const isRolling = status === 'rolling' || isAnimating;
  const winningNumbers = dice ? [dice.die1, dice.die2] : [];

  // Calculate available cash for bets (cash minus already placed bets)
  const availableForBets = cash + totalBet; // During betting phase, cash hasn't been deducted yet

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gundaata!</Text>
      </View>

      {/* Cash Display */}
      <CashDisplay cash={cash} lastWin={lastWin} highScore={highScore} />

      {/* Dice Area */}
      <View style={styles.diceArea}>
        <Dice
          value={dice?.die1 ?? null}
          isRolling={isRolling}
          isWinner={dice ? bets[dice.die1 as DiceNumber] > 0 : false}
        />
        <View style={styles.diceSpacer} />
        <Dice
          value={dice?.die2 ?? null}
          isRolling={isRolling}
          isWinner={dice ? bets[dice.die2 as DiceNumber] > 0 : false}
        />
      </View>

      {/* Status Message */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isRolling
            ? 'Rolling...'
            : dice
            ? lastWin > 0
              ? `Won $${lastWin.toLocaleString()}!`
              : 'No luck this time'
            : 'Place your bets!'}
        </Text>
      </View>

      {/* Betting Area */}
      <ScrollView style={styles.bettingArea} contentContainerStyle={styles.bettingContent}>
        {DICE_NUMBERS.map(num => (
          <BetInput
            key={num}
            diceNumber={num}
            value={bets[num]}
            maxBet={availableForBets - (totalBet - bets[num])}
            disabled={isRolling}
            onBetChange={placeBet}
            onIncrement={incrementBet}
          />
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {/* Total bet display */}
        <View style={styles.totalBetContainer}>
          <Text style={styles.totalBetLabel}>Total Bet:</Text>
          <Text style={styles.totalBetValue}>${totalBet.toLocaleString()}</Text>
        </View>

        <View style={styles.buttonRow}>
          {/* Clear button */}
          <TouchableOpacity
            style={[styles.clearButton, (isRolling || totalBet === 0) && styles.buttonDisabled]}
            onPress={clearBets}
            disabled={isRolling || totalBet === 0}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>

          {/* Roll button */}
          <TouchableOpacity
            style={[styles.rollButton, !canRoll && styles.buttonDisabled]}
            onPress={handleRoll}
            disabled={!canRoll || isAnimating}
          >
            <Text style={styles.rollButtonText}>
              {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game Over Modal */}
      <GameOverModal
        visible={isGameOver}
        highScore={highScore}
        isNewHighScore={highScore > prevHighScore}
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
    backgroundColor: '#477548', // Casino green
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  diceArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  diceSpacer: {
    width: 24,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  bettingArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bettingContent: {
    paddingBottom: 16,
  },
  actions: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  totalBetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalBetLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  totalBetValue: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#666',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rollButton: {
    flex: 2,
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#333',
    opacity: 0.6,
  },
});

export default GameScreen;
