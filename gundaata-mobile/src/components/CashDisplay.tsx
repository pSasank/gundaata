/**
 * CashDisplay Component
 * Displays current cash and last win amount
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CashDisplayProps {
  cash: number;
  lastWin?: number;
  highScore?: number;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function CashDisplay({ cash, lastWin = 0, highScore = 0 }: CashDisplayProps) {
  return (
    <View style={styles.container}>
      {/* Main cash display */}
      <View style={styles.mainDisplay}>
        <Text style={styles.label}>CASH</Text>
        <Text style={styles.amount}>${formatNumber(cash)}</Text>
      </View>

      {/* Last win indicator */}
      {lastWin > 0 && (
        <View style={styles.winDisplay}>
          <Text style={styles.winLabel}>WON</Text>
          <Text style={styles.winAmount}>+${formatNumber(lastWin)}</Text>
        </View>
      )}

      {/* High score */}
      <View style={styles.highScoreDisplay}>
        <Text style={styles.highScoreLabel}>HIGH</Text>
        <Text style={styles.highScoreAmount}>${formatNumber(highScore)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  mainDisplay: {
    flex: 1,
  },
  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  amount: {
    color: '#4ADE80',
    fontSize: 28,
    fontWeight: 'bold',
  },
  winDisplay: {
    backgroundColor: '#166534',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  winLabel: {
    color: '#86EFAC',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  winAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  highScoreDisplay: {
    alignItems: 'flex-end',
  },
  highScoreLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  highScoreAmount: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CashDisplay;
