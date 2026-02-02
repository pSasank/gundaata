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

// Bold colors for each number — inspired by painted gundaata boards
const NUMBER_COLORS: Record<number, { text: string; bg: string }> = {
  1: { text: '#FFFFFF', bg: '#D32F2F' },   // Red
  2: { text: '#FFFFFF', bg: '#1565C0' },   // Blue
  3: { text: '#FFFFFF', bg: '#2E7D32' },   // Green
  4: { text: '#FFFFFF', bg: '#E65100' },   // Orange
  5: { text: '#FFFFFF', bg: '#6A1B9A' },   // Purple
  6: { text: '#FFFFFF', bg: '#00838F' },   // Teal
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
        { backgroundColor: NUMBER_COLORS[diceNumber].bg },
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
          { color: NUMBER_COLORS[diceNumber].text },
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    margin: 2,
    borderRadius: 6,
    position: 'relative',
    minHeight: 80,
  },
  winningCell: {
    borderColor: '#FFD740',
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  disabledCell: {
    opacity: 0.6,
  },
  number: {
    fontSize: 48,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  winningNumber: {
    textShadowColor: '#FFD740',
    textShadowRadius: 12,
  },
  betBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FFD740',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 36,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  betText: {
    color: '#1B1B1B',
    fontSize: 13,
    fontWeight: '900',
  },
});

export default BetCell;
