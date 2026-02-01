/**
 * ChipSelector Component
 * Row of betting chips at the bottom of the screen.
 * Player selects a chip amount, then taps a number on the board to bet.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ChipSelectorProps {
  selectedChip: number;
  onSelectChip: (amount: number) => void;
  onClear: () => void;
  disabled: boolean;
  totalBet: number;
}

const CHIP_VALUES = [10, 50, 100, 500];

const CHIP_COLORS: Record<number, { bg: string; border: string }> = {
  10: { bg: '#FFFFFF', border: '#9E9E9E' },
  50: { bg: '#2196F3', border: '#1565C0' },
  100: { bg: '#4CAF50', border: '#2E7D32' },
  500: { bg: '#F44336', border: '#C62828' },
};

export function ChipSelector({
  selectedChip,
  onSelectChip,
  onClear,
  disabled,
  totalBet,
}: ChipSelectorProps) {
  return (
    <View style={styles.container}>
      {/* Chip buttons */}
      <View style={styles.chipsRow}>
        {CHIP_VALUES.map(value => {
          const isSelected = selectedChip === value;
          const colors = CHIP_COLORS[value];
          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.chip,
                { backgroundColor: colors.bg, borderColor: colors.border },
                isSelected && styles.chipSelected,
                disabled && styles.chipDisabled,
              ]}
              onPress={() => onSelectChip(value)}
              disabled={disabled}
              accessibilityLabel={`Select ${value} chip`}
              testID={`chip-${value}`}
            >
              <Text
                style={[
                  styles.chipText,
                  value === 10 && styles.chipTextDark,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Clear button */}
        <TouchableOpacity
          style={[styles.clearButton, (disabled || totalBet === 0) && styles.chipDisabled]}
          onPress={onClear}
          disabled={disabled || totalBet === 0}
          accessibilityLabel="Clear all bets"
          testID="clear-bets"
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Total bet display */}
      {totalBet > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Bet:</Text>
          <Text style={styles.totalValue}>${totalBet.toLocaleString()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  chipSelected: {
    transform: [{ scale: 1.15 }],
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  chipTextDark: {
    color: '#333333',
  },
  chipTextSelected: {
    fontSize: 17,
  },
  clearButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#5D4037',
    borderRadius: 8,
    marginLeft: 10,
  },
  clearText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  totalLabel: {
    color: '#D7CCC8',
    fontSize: 13,
    marginRight: 6,
  },
  totalValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChipSelector;
