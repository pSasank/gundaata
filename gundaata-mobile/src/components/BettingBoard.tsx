/**
 * BettingBoard Component
 * The main gundaata board layout — a 3x3 grid with:
 *   Row 1: Numbers 1, 2, 3
 *   Row 2: (empty), Dice Area, (empty)
 *   Row 3: Numbers 4, 5, 6
 *
 * Mimics the real gundaata board layout from the reference photo.
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
  canRoll: boolean;
  lastWin: number;
  winningNumbers: number[];
  disabled: boolean;
  onCellPress: (diceNumber: DiceNumber) => void;
  onRoll: () => void;
}

export function BettingBoard({
  bets,
  dice,
  isRolling,
  canRoll,
  lastWin,
  winningNumbers,
  disabled,
  onCellPress,
  onRoll,
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
    <View style={styles.board}>
      {/* Row 1: Numbers 1, 2, 3 */}
      <View style={styles.row}>
        {renderCell(1)}
        {renderCell(2)}
        {renderCell(3)}
      </View>

      {/* Row 2: Empty, Dice, Empty */}
      <View style={styles.row}>
        <View style={styles.sideCell} />
        <DiceArea
          dice={dice}
          isRolling={isRolling}
          canRoll={canRoll}
          lastWin={lastWin}
          onRoll={onRoll}
        />
        <View style={styles.sideCell} />
      </View>

      {/* Row 3: Numbers 4, 5, 6 */}
      <View style={styles.row}>
        {renderCell(4)}
        {renderCell(5)}
        {renderCell(6)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#A1887F',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#5D4037',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
  },
  sideCell: {
    flex: 1,
    backgroundColor: '#BCAAA4',
    borderWidth: 1,
    borderColor: '#8B7355',
    margin: 2,
    borderRadius: 4,
  },
});

export default BettingBoard;
