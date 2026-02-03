/**
 * Skin/Theme Type Definitions
 * Each regional variant can have its own visual identity.
 */

export interface AppSkin {
  id: string;
  name: string;

  // Currency
  currencySymbol: string;
  currencyPosition: 'before' | 'after';  // $100 vs 100₹

  // Celebration style (emojis/decorations for win messages)
  celebrationPrefix: string;
  celebrationSuffix: string;
}
