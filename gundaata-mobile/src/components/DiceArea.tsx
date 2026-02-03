/**
 * DiceArea Component
 * Center display area of the gundaata board.
 * Shows a decorative rangoli motif before first roll, dice after rolling.
 * Display only — the Roll button is now separate.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dice } from './Dice';
import { DiceRoll } from '../utils/dice';
import { t, formatCurrency } from '../i18n';

interface DiceAreaProps {
  dice: DiceRoll | null;
  isRolling: boolean;
  lastWin: number;
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
            <View style={motifStyles.centerDot} />
          </View>
        </View>
      </View>
      {/* Cardinal petals */}
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

export function DiceArea({ dice, isRolling, lastWin }: DiceAreaProps) {
  const hasDice = dice !== null;

  return (
    <View style={styles.container} testID="dice-area">
      {hasDice ? (
        <>
          <View style={styles.diceRow}>
            <Dice value={dice.die1} isRolling={isRolling} size={50} />
            <View style={styles.diceSpacer} />
            <Dice value={dice.die2} isRolling={isRolling} size={50} />
          </View>
          {!isRolling && (
            <Text style={[styles.resultText, lastWin > 0 ? styles.winText : styles.loseText]}>
              {lastWin > 0 ? t('winAmount', { amount: formatCurrency(lastWin) }) : t('noLuck')}
            </Text>
          )}
          {isRolling && <Text style={styles.rollingText}>{t('rollingText')}</Text>}
        </>
      ) : (
        <RangoliMotif />
      )}
    </View>
  );
}

const motifStyles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#E65100',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#FFB300',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C62828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD54F',
  },
  petal: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6F00',
  },
  petalTop: { top: 0, left: '50%', marginLeft: -6 },
  petalBottom: { bottom: 0, left: '50%', marginLeft: -6 },
  petalLeft: { left: 0, top: '50%', marginTop: -6 },
  petalRight: { right: 0, top: '50%', marginTop: -6 },
  smallPetal: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
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
    paddingVertical: 6,
    minHeight: 80,
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
  resultText: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  winText: {
    color: '#2E7D32',
  },
  loseText: {
    color: '#C62828',
  },
  rollingText: {
    color: '#BF360C',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default DiceArea;
