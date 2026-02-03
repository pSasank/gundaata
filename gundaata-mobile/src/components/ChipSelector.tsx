/**
 * ChipSelector Component
 * Bottom bar with chip denomination buttons, instructional text,
 * and the prominent Roll Dice button.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { t, formatCurrency } from '../i18n';

interface ChipSelectorProps {
  selectedChip: number;
  onSelectChip: (amount: number) => void;
  onClear: () => void;
  onRoll: () => void;
  canRoll: boolean;
  isRolling: boolean;
  disabled: boolean;
  totalBet: number;
}

const CHIP_VALUES = [10, 50, 100, 500];

const CHIP_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  10: { bg: '#ECEFF1', border: '#90A4AE', text: '#37474F' },
  50: { bg: '#1E88E5', border: '#0D47A1', text: '#FFFFFF' },
  100: { bg: '#43A047', border: '#1B5E20', text: '#FFFFFF' },
  500: { bg: '#E53935', border: '#B71C1C', text: '#FFFFFF' },
};

export function ChipSelector({
  selectedChip,
  onSelectChip,
  onClear,
  onRoll,
  canRoll,
  isRolling,
  disabled,
  totalBet,
}: ChipSelectorProps) {
  return (
    <View style={styles.container}>
      {/* Instructional text */}
      <Text style={styles.instruction}>
        {isRolling
          ? t('rollingInstruction')
          : totalBet > 0
            ? t('totalBetInstruction', { totalBet: formatCurrency(totalBet) })
            : t('placeBetInstruction', { chipValue: formatCurrency(selectedChip) })}
      </Text>

      {/* Chip row */}
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
                isSelected && { borderColor: '#FFD740' },
                disabled && styles.chipDisabled,
              ]}
              onPress={() => onSelectChip(value)}
              disabled={disabled}
              accessibilityLabel={t('selectChipA11y', { value: String(value) })}
              testID={`chip-${value}`}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: colors.text },
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
          accessibilityLabel={t('clearBetsA11y')}
          testID="clear-bets"
        >
          <Text style={styles.clearText}>{t('clearButton')}</Text>
        </TouchableOpacity>
      </View>

      {/* Roll Dice button — the primary CTA */}
      <TouchableOpacity
        style={[styles.rollButton, !canRoll && styles.rollButtonDisabled]}
        onPress={onRoll}
        disabled={!canRoll}
        activeOpacity={0.8}
        accessibilityLabel={isRolling ? t('diceRollingA11y') : t('rollDiceA11y')}
        testID="roll-button"
      >
        <Text style={[styles.rollButtonText, !canRoll && styles.rollButtonTextDisabled]}>
          {isRolling ? t('rollingButton') : t('rollDiceButton')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  instruction: {
    color: '#CE93D8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  chip: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    transform: [{ scale: 1.2 }],
    borderWidth: 4,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chipTextSelected: {
    fontSize: 15,
    fontWeight: '900',
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
    fontSize: 13,
    fontWeight: 'bold',
  },
  rollButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  rollButtonDisabled: {
    backgroundColor: '#424242',
    borderColor: '#616161',
    shadowOpacity: 0,
    elevation: 0,
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
  },
  rollButtonTextDisabled: {
    color: '#9E9E9E',
  },
});

export default ChipSelector;
