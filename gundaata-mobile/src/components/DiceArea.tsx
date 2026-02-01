/**
 * DiceArea Component
 * Center area of the gundaata board.
 * Shows a decorative motif before first roll, dice after rolling.
 * Tapping rolls the dice.
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

function RangoliMotif() {
  return (
    <View style={motifStyles.container}>
      {/* Outer ring */}
      <View style={motifStyles.outerRing}>
        {/* Middle ring */}
        <View style={motifStyles.middleRing}>
          {/* Inner ring */}
          <View style={motifStyles.innerRing}>
            {/* Center dot */}
            <View style={motifStyles.centerDot} />
          </View>
        </View>
      </View>
      {/* Petal decorations - 4 petals */}
      <View style={[motifStyles.petal, motifStyles.petalTop]} />
      <View style={[motifStyles.petal, motifStyles.petalBottom]} />
      <View style={[motifStyles.petal, motifStyles.petalLeft]} />
      <View style={[motifStyles.petal, motifStyles.petalRight]} />
      {/* Diagonal petals */}
      <View style={[motifStyles.smallPetal, motifStyles.petalTopLeft]} />
      <View style={[motifStyles.smallPetal, motifStyles.petalTopRight]} />
      <View style={[motifStyles.smallPetal, motifStyles.petalBottomLeft]} />
      <View style={[motifStyles.smallPetal, motifStyles.petalBottomRight]} />
    </View>
  );
}

export function DiceArea({ dice, isRolling, canRoll, lastWin, onRoll }: DiceAreaProps) {
  const hasDice = dice !== null;

  return (
    <TouchableOpacity
      style={[styles.container, canRoll && styles.canRoll]}
      onPress={onRoll}
      disabled={!canRoll}
      activeOpacity={0.8}
      accessibilityLabel={isRolling ? 'Dice rolling' : canRoll ? 'Tap to roll dice' : 'Place bets first'}
      testID="dice-area"
    >
      {hasDice ? (
        // Show dice after roll
        <View style={styles.diceRow}>
          <Dice value={dice.die1} isRolling={isRolling} size={52} />
          <View style={styles.diceSpacer} />
          <Dice value={dice.die2} isRolling={isRolling} size={52} />
        </View>
      ) : (
        // Show decorative motif before first roll
        <RangoliMotif />
      )}

      {/* Status text */}
      <Text style={[styles.statusText, hasDice && lastWin > 0 && styles.winText]}>
        {isRolling
          ? 'Rolling...'
          : hasDice
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

const motifStyles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#E65100',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFB300',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#C62828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD54F',
  },
  petal: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6F00',
  },
  petalTop: { top: 2, left: '50%', marginLeft: -5 },
  petalBottom: { bottom: 2, left: '50%', marginLeft: -5 },
  petalLeft: { left: 2, top: '50%', marginTop: -5 },
  petalRight: { right: 2, top: '50%', marginTop: -5 },
  smallPetal: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#AB47BC',
  },
  petalTopLeft: { top: 8, left: 8 },
  petalTopRight: { top: 8, right: 8 },
  petalBottomLeft: { bottom: 8, left: 8 },
  petalBottomRight: { bottom: 8, right: 8 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#BF360C',
    margin: 2,
    borderRadius: 4,
    paddingVertical: 4,
  },
  canRoll: {
    backgroundColor: '#FFF8E1',
    borderColor: '#E65100',
    borderWidth: 2.5,
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
    color: '#BF360C',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  winText: {
    color: '#2E7D32',
  },
});

export default DiceArea;
