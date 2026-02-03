/**
 * Dice Component
 * Displays a single die with its face value
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { t } from '../i18n';

interface DiceProps {
  value: number | null;
  isRolling?: boolean;
  isWinner?: boolean;
  size?: number;
}

// Dice face patterns (dots positions for each value)
const DICE_PATTERNS: Record<number, number[][]> = {
  1: [[1, 1]], // Center
  2: [[0, 0], [2, 2]], // Top-left, bottom-right
  3: [[0, 0], [1, 1], [2, 2]], // Diagonal
  4: [[0, 0], [0, 2], [2, 0], [2, 2]], // Corners
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]], // Corners + center
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]], // Two columns
};

export function Dice({ value, isRolling = false, isWinner = false, size = 80 }: DiceProps) {
  const dotSize = size / 6;
  const cellSize = size / 3;

  const renderDots = () => {
    if (value === null || value < 1 || value > 6) {
      return null;
    }

    const pattern = DICE_PATTERNS[value];
    return pattern.map((pos, index) => {
      const [row, col] = pos;
      return (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              top: row * cellSize + (cellSize - dotSize) / 2,
              left: col * cellSize + (cellSize - dotSize) / 2,
            },
          ]}
        />
      );
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 8,
        },
        isWinner && styles.winner,
        isRolling && styles.rolling,
      ]}
      accessibilityLabel={value ? t('diceShowingA11y', { value: String(value) }) : t('diceA11y')}
      accessibilityRole="image"
    >
      {renderDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dot: {
    backgroundColor: '#1a1a1a',
    position: 'absolute',
  },
  winner: {
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
  },
  rolling: {
    opacity: 0.7,
  },
});

export default Dice;
