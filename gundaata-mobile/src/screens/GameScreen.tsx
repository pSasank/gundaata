/**
 * GameScreen
 * Main game screen with authentic gundaata board layout.
 * Inspired by real gundaata arenas — vibrant colors, festive patterns.
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

/** Decorative corner ornament */
function CornerOrnament({ position }: { position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' }) {
  const isTop = position.includes('top');
  const isLeft = position.includes('Left');
  return (
    <View style={[
      ornamentStyles.corner,
      isTop ? { top: 0 } : { bottom: 0 },
      isLeft ? { left: 0 } : { right: 0 },
    ]}>
      <View style={[ornamentStyles.arc, {
        borderTopLeftRadius: isTop && isLeft ? 40 : 0,
        borderTopRightRadius: isTop && !isLeft ? 40 : 0,
        borderBottomLeftRadius: !isTop && isLeft ? 40 : 0,
        borderBottomRightRadius: !isTop && !isLeft ? 40 : 0,
      }]}>
        <View style={ornamentStyles.arcInner} />
      </View>
    </View>
  );
}

/** Decorative side accent stripe */
function SideAccent({ side }: { side: 'left' | 'right' }) {
  return (
    <View style={[accentStyles.container, side === 'left' ? { left: 0 } : { right: 0 }]}>
      <View style={accentStyles.stripe1} />
      <View style={accentStyles.stripe2} />
      <View style={accentStyles.stripe3} />
    </View>
  );
}

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

  useEffect(() => {
    loadSavedState();
  }, []);

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

      {/* Background decorations */}
      <CornerOrnament position="topLeft" />
      <CornerOrnament position="topRight" />
      <CornerOrnament position="bottomLeft" />
      <CornerOrnament position="bottomRight" />
      <SideAccent side="left" />
      <SideAccent side="right" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleAccentLeft} />
          <Text style={styles.title}>GUNDAATA</Text>
          <View style={styles.titleAccentRight} />
        </View>
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
            <Text style={styles.statLabel}>HIGH SCORE</Text>
            <Text style={styles.highValue}>${highScore.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* The Board (display + bet placement only) */}
      <View style={styles.boardContainer}>
        <BettingBoard
          bets={bets}
          dice={dice}
          isRolling={isRolling}
          lastWin={lastWin}
          winningNumbers={winningNumbers}
          disabled={isRolling}
          onCellPress={handleCellPress}
        />
      </View>

      {/* Bottom controls: instruction, chips, Roll button */}
      <View style={styles.bottomArea}>
        <ChipSelector
          selectedChip={selectedChip}
          onSelectChip={setSelectedChip}
          onClear={clearBets}
          onRoll={handleRoll}
          canRoll={canRoll && !isAnimating}
          isRolling={isRolling}
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

const ornamentStyles = StyleSheet.create({
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    zIndex: 0,
  },
  arc: {
    width: 40,
    height: 40,
    backgroundColor: '#E65100',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  arcInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF8F00',
    opacity: 0.8,
  },
});

const accentStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    width: 5,
    height: '40%',
    zIndex: 0,
  },
  stripe1: {
    flex: 1,
    backgroundColor: '#E65100',
    opacity: 0.4,
    marginBottom: 2,
  },
  stripe2: {
    flex: 1,
    backgroundColor: '#FFB300',
    opacity: 0.3,
    marginBottom: 2,
  },
  stripe3: {
    flex: 1,
    backgroundColor: '#AB47BC',
    opacity: 0.3,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A148C',
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 6,
    zIndex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleAccentLeft: {
    width: 30,
    height: 3,
    backgroundColor: '#FFB300',
    marginRight: 10,
    borderRadius: 2,
  },
  titleAccentRight: {
    width: 30,
    height: 3,
    backgroundColor: '#FFB300',
    marginLeft: 10,
    borderRadius: 2,
  },
  title: {
    color: '#FFD54F',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: '#E65100',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#CE93D8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cashValue: {
    color: '#69F0AE',
    fontSize: 22,
    fontWeight: 'bold',
  },
  highValue: {
    color: '#FFD740',
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 1,
  },
  bottomArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingBottom: 6,
    zIndex: 1,
  },
});

export default GameScreen;
