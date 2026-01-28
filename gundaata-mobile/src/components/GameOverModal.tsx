/**
 * GameOverModal Component
 * Displayed when player loses all cash
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface GameOverModalProps {
  visible: boolean;
  highScore: number;
  isNewHighScore: boolean;
  onNewGame: () => void;
  onWatchAd: () => void;
  adAvailable: boolean;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function GameOverModal({
  visible,
  highScore,
  isNewHighScore,
  onNewGame,
  onWatchAd,
  adAvailable,
}: GameOverModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <View style={styles.modal} accessibilityRole="alert">
          {/* Header */}
          <Text style={styles.title}>Game Over</Text>

          {/* New high score celebration */}
          {isNewHighScore && (
            <View style={styles.celebration}>
              <Text style={styles.celebrationText}>🎉 New High Score! 🎉</Text>
            </View>
          )}

          {/* High score display */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>High Score</Text>
            <Text style={styles.scoreValue}>${formatNumber(highScore)}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            {/* Watch Ad for Revival */}
            <TouchableOpacity
              style={[styles.adButton, !adAvailable && styles.buttonDisabled]}
              onPress={onWatchAd}
              disabled={!adAvailable}
              accessibilityLabel="Watch advertisement to continue"
            >
              <Text style={[styles.adButtonText, !adAvailable && styles.buttonTextDisabled]}>
                {adAvailable ? '📺 Watch Ad for $500' : 'Ad Not Available'}
              </Text>
            </TouchableOpacity>

            {/* New Game */}
            <TouchableOpacity
              style={styles.newGameButton}
              onPress={onNewGame}
              accessibilityLabel="Start new game"
            >
              <Text style={styles.newGameButtonText}>New Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
  },
  title: {
    color: '#FF4444',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  celebration: {
    backgroundColor: '#166534',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  celebrationText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: 'bold',
  },
  buttons: {
    width: '100%',
  },
  adButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  adButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#333',
  },
  buttonTextDisabled: {
    color: '#666',
  },
  newGameButton: {
    backgroundColor: '#477548',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newGameButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameOverModal;
