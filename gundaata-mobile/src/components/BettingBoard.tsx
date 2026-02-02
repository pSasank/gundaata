/**
 * BettingBoard Component
 * The main gundaata board layout with decorative frame.
 *
 * Layout:
 *   Row 1: Numbers 1, 2, 3
 *   Row 2: (decorated), Dice Area (display only), (decorated)
 *   Row 3: Numbers 4, 5, 6
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BetCell } from './BetCell';
import { DiceArea } from './DiceArea';
import { Bets, DiceNumber } from '../utils/betting';
import { DiceRoll } from '../utils/dice';

interface BettingBoardProps {
  bets: Bets;
  dice: DiceRoll | null;
  isRolling: boolean;
  lastWin: number;
  winningNumbers: number[];
  disabled: boolean;
  onCellPress: (diceNumber: DiceNumber) => void;
}

/** Decorative corner piece for the side cells */
function DecorativeCell() {
  return (
    <View style={decoStyles.cell}>
      <View style={decoStyles.diamond}>
        <View style={decoStyles.diamondInner} />
      </View>
      <View style={[decoStyles.cornerDot, decoStyles.topLeft]} />
      <View style={[decoStyles.cornerDot, decoStyles.topRight]} />
      <View style={[decoStyles.cornerDot, decoStyles.bottomLeft]} />
      <View style={[decoStyles.cornerDot, decoStyles.bottomRight]} />
    </View>
  );
}

export function BettingBoard({
  bets,
  dice,
  isRolling,
  lastWin,
  winningNumbers,
  disabled,
  onCellPress,
}: BettingBoardProps) {
  const renderCell = (num: DiceNumber) => (
    <BetCell
      key={num}
      diceNumber={num}
      betAmount={bets[num]}
      disabled={disabled}
      isWinningNumber={winningNumbers.includes(num)}
      onPress={onCellPress}
    />
  );

  return (
    <View style={styles.outerFrame}>
      <View style={styles.stripeOrange} />
      <View style={styles.stripeRed} />

      <View style={styles.board}>
        {/* Row 1: Numbers 1, 2, 3 */}
        <View style={styles.row}>
          {renderCell(1)}
          {renderCell(2)}
          {renderCell(3)}
        </View>

        {/* Row 2: Decorated, Dice display, Decorated */}
        <View style={styles.row}>
          <DecorativeCell />
          <DiceArea
            dice={dice}
            isRolling={isRolling}
            lastWin={lastWin}
          />
          <DecorativeCell />
        </View>

        {/* Row 3: Numbers 4, 5, 6 */}
        <View style={styles.row}>
          {renderCell(4)}
          {renderCell(5)}
          {renderCell(6)}
        </View>
      </View>

      <View style={styles.stripeRed} />
      <View style={styles.stripeOrange} />
    </View>
  );
}

const decoStyles = StyleSheet.create({
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#BF360C',
    margin: 2,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 80,
  },
  diamond: {
    width: 30,
    height: 30,
    transform: [{ rotate: '45deg' }],
    borderWidth: 2,
    borderColor: '#E65100',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondInner: {
    width: 14,
    height: 14,
    backgroundColor: '#FF6F00',
    borderRadius: 2,
  },
  cornerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#AB47BC',
  },
  topLeft: { top: 6, left: 6 },
  topRight: { top: 6, right: 6 },
  bottomLeft: { bottom: 6, left: 6 },
  bottomRight: { bottom: 6, right: 6 },
});

const styles = StyleSheet.create({
  outerFrame: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  stripeOrange: {
    height: 6,
    backgroundColor: '#FF6F00',
  },
  stripeRed: {
    height: 4,
    backgroundColor: '#C62828',
  },
  board: {
    backgroundColor: '#BF360C',
    padding: 2,
  },
  row: {
    flexDirection: 'row',
  },
});

export default BettingBoard;
