/**
 * Tamil translations
 * தமிழ் மொழிபெயர்ப்புகள்
 */

import { Translations } from '../types';

export const ta: Translations = {
  // App
  appTitle: 'குண்டாட்டா',

  // Game Screen header
  cashLabel: 'பணம்',
  highScoreLabel: 'உயர் மதிப்பெண்',

  // Chip Selector instructions
  rollingInstruction: 'பகடை உருட்டுகிறோம்...',
  totalBetInstruction: 'மொத்த பந்தயம்: {totalBet} — மேலும் சேர்க்க எண்களைத் தட்டுங்கள்',
  placeBetInstruction: '{chipValue} பந்தயம் கட்ட பலகையில் எண்ணைத் தட்டுங்கள்',

  // Chip Selector buttons
  clearButton: 'அழி',
  rollingButton: 'உருட்டுகிறோம்...',
  rollDiceButton: 'பகடை உருட்டு',

  // Dice Area
  winAmount: '+{amount}',
  noLuck: 'அதிர்ஷ்டமில்லை',
  rollingText: 'உருட்டுகிறோம்...',

  // Game Over Modal
  gameOver: 'ஆட்டம் முடிந்தது',
  newHighScore: 'புதிய உயர் மதிப்பெண்!',
  highScoreModalLabel: 'உயர் மதிப்பெண்',
  watchAdButton: '{amount} க்கு விளம்பரம் பாருங்கள்',
  adNotAvailable: 'விளம்பரம் கிடைக்கவில்லை',
  newGameButton: 'புதிய ஆட்டம்',

  // Accessibility labels
  selectChipA11y: '{value} சிப் தேர்ந்தெடுக்கவும்',
  clearBetsA11y: 'அனைத்து பந்தயங்களையும் அழிக்கவும்',
  diceRollingA11y: 'பகடை உருளுகிறது',
  rollDiceA11y: 'பகடை உருட்டுங்கள்',
  betCellA11y: 'எண் {number}, பந்தயம் {bet}',
  diceShowingA11y: 'பகடை {value} காட்டுகிறது',
  diceA11y: 'பகடை',
  watchAdA11y: 'தொடர விளம்பரம் பாருங்கள்',
  newGameA11y: 'புதிய ஆட்டம் தொடங்குங்கள்',
};
