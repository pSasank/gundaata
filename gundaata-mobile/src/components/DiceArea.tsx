/**
 * DiceArea Component
 * Center area of the gundaata board where dice are displayed.
 * Also serves as the Roll button when tapped.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dice } from './Dice';
import { DiceRoll } from '../utils/dice';

interface DiceAreaProps {
  dice: DiceRoll | null;
  isRolling: boolean;
  canRoll: boolean;
  lastWin: number;
  onRoll: () => void;
}

export function DiceArea({ dice, isRolling, canRoll, lastWin, onRoll }: DiceAreaProps) {
  return (
    <TouchableOpacity
      style={[styles.container, canRoll && styles.canRoll]}
      onPress={onRoll}
      disabled={!canRoll}
      activeOpacity={0.8}
      accessibilityLabel={isRolling ? 'Dice rolling' : canRoll ? 'Tap to roll dice' : 'Place bets first'}
      testID="dice-area"
    >
      {dice ? (
        <View style={styles.diceRow}>
          <Dice value={dice.die1} isRolling={isRolling} size={52} />
          <View style={styles.diceSpacer} />
          <Dice value={dice.die2} isRolling={isRolling} size={52} />
        </View>
      ) : (
        <View style={styles.diceRow}>
          <Dice value={null} size={52} />
          <View style={styles.diceSpacer} />
          <Dice value={null} size={52} />
        </View>
      )}

      {/* Status text */}
      <Text style={styles.statusText}>
        {isRolling
          ? 'Rolling...'
          : dice
            ? lastWin > 0
              ? `Won $${lastWin.toLocaleString()}!`
              : 'No luck'
            : canRoll
              ? 'Tap to Roll!'
              : 'Place bets'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7CCC8',
    borderWidth: 2,
    borderColor: '#8B7355',
    margin: 2,
    borderRadius: 4,
    paddingVertical: 4,
  },
  canRoll: {
    backgroundColor: '#EFEBE9',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  diceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  diceSpacer: {
    width: 10,
  },
  statusText: {
    color: '#5D4037',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default DiceArea;
