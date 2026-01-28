/**
 * BetInput Component
 * Input for placing bets on a dice number with quick-add buttons
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { DiceNumber } from '../utils/betting';

interface BetInputProps {
  diceNumber: DiceNumber;
  value: number;
  maxBet: number;
  disabled?: boolean;
  onBetChange: (diceNumber: DiceNumber, amount: number) => void;
  onIncrement: (diceNumber: DiceNumber, increment: number) => void;
}

const QUICK_BETS = [10, 50, 100, 500];

export function BetInput({
  diceNumber,
  value,
  maxBet,
  disabled = false,
  onBetChange,
  onIncrement,
}: BetInputProps) {
  const handleTextChange = (text: string) => {
    const numValue = parseInt(text, 10);
    if (isNaN(numValue)) {
      onBetChange(diceNumber, 0);
    } else {
      const capped = Math.min(Math.max(0, numValue), maxBet);
      onBetChange(diceNumber, capped);
    }
  };

  const handleIncrement = (amount: number) => {
    if (!disabled && value + amount <= maxBet) {
      onIncrement(diceNumber, amount);
    }
  };

  const handleClear = () => {
    onBetChange(diceNumber, 0);
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      {/* Dice number label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{diceNumber}</Text>
      </View>

      {/* Bet input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value > 0 ? String(value) : ''}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          editable={!disabled}
          placeholder="0"
          placeholderTextColor="#999"
          accessibilityLabel={`Bet on dice number ${diceNumber}`}
          testID={`bet-input-${diceNumber}`}
        />
        {value > 0 && !disabled && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            testID={`clear-bet-${diceNumber}`}
          >
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick bet buttons */}
      <View style={styles.quickBets}>
        {QUICK_BETS.map(amount => {
          const canAdd = value + amount <= maxBet;
          return (
            <TouchableOpacity
              key={amount}
              style={[
                styles.quickBetButton,
                (!canAdd || disabled) && styles.quickBetDisabled,
              ]}
              onPress={() => handleIncrement(amount)}
              disabled={!canAdd || disabled}
              testID={`quick-bet-${diceNumber}-${amount}`}
            >
              <Text
                style={[
                  styles.quickBetText,
                  (!canAdd || disabled) && styles.quickBetTextDisabled,
                ]}
              >
                +{amount}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  labelContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#4a4a4a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    color: '#888',
    fontSize: 20,
  },
  quickBets: {
    flexDirection: 'row',
  },
  quickBetButton: {
    backgroundColor: '#477548',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 4,
  },
  quickBetDisabled: {
    backgroundColor: '#333',
  },
  quickBetText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickBetTextDisabled: {
    color: '#666',
  },
});

export default BetInput;
