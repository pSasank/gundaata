/**
 * BetCell Component
 * A single numbered cell on the gundaata board.
 * Shows the dice number and any bet placed on it.
 * Tap to place the currently selected chip amount.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DiceNumber } from '../utils/betting';

interface BetCellProps {
  diceNumber: DiceNumber;
  betAmount: number;
  disabled: boolean;
  isWinningNumber: boolean;
  onPress: (diceNumber: DiceNumber) => void;
}

// Bold colors for each number — inspired by painted board
const NUMBER_COLORS: Record<number, string> = {
  1: '#E53935', // Red
  2: '#1E88E5', // Blue
  3: '#43A047', // Green
  4: '#FB8C00', // Orange
  5: '#8E24AA', // Purple
  6: '#00ACC1', // Teal
};

export function BetCell({
  diceNumber,
  betAmount,
  disabled,
  isWinningNumber,
  onPress,
}: BetCellProps) {
  return (
    <TouchableOpacity
      style={[
        styles.cell,
        isWinningNumber && styles.winningCell,
        disabled && styles.disabledCell,
      ]}
      onPress={() => onPress(diceNumber)}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityLabel={`Number ${diceNumber}, bet ${betAmount}`}
      testID={`bet-cell-${diceNumber}`}
    >
      {/* Large number */}
      <Text
        style={[
          styles.number,
          { color: NUMBER_COLORS[diceNumber] },
          isWinningNumber && styles.winningNumber,
        ]}
      >
        {diceNumber}
      </Text>

      {/* Bet amount shown as cash on the cell */}
      {betAmount > 0 && (
        <View style={styles.betBadge}>
          <Text style={styles.betText}>{betAmount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6C8',
    borderWidth: 2,
    borderColor: '#8B7355',
    margin: 2,
    borderRadius: 4,
    position: 'relative',
  },
  winningCell: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  disabledCell: {
    opacity: 0.6,
  },
  number: {
    fontSize: 48,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  winningNumber: {
    textShadowColor: '#FFD700',
    textShadowRadius: 8,
  },
  betBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 36,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  betText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BetCell;
