# Gundaata Mobile App Roadmap

## Overview
Convert Gundaata from a web-based dice game to a polished Android app on Google Play Store with enhanced UI, new features, test coverage, and monetization through ads.

**Development Philosophy: Test-Driven Development (TDD)**
- Write tests FIRST, then implementation
- Red → Green → Refactor cycle
- No feature ships without tests
- See [TESTING.md](./TESTING.md) for comprehensive test specifications

---

## Phase Order (TDD Approach)

| Phase | Description | Priority |
|-------|-------------|----------|
| 1 | Platform & Architecture Setup | Foundation |
| 2 | **Testing Infrastructure** | **FIRST** |
| 3 | Core Game Logic (with tests) | Critical |
| 4 | UI Components (with tests) | Critical |
| 5 | New Features (with tests) | High |
| 6 | Ad Integration (with tests) | High |
| 7 | Play Store Preparation | Final |

---

## Phase 1: Platform & Architecture Setup

### 1.1 Choose Technology Stack
**Recommended: React Native or Flutter**

| Option | Pros | Cons |
|--------|------|------|
| **React Native** | Large ecosystem, JS-based (easy transition), Expo for quick setup | Performance slightly lower than native |
| **Flutter** | Excellent performance, beautiful UI widgets, single codebase for iOS too | Learning Dart, larger app size |
| **Capacitor/Ionic** | Wrap existing web code directly | Less native feel, performance limitations |
| **PWA** | Minimal changes, can list on Play Store via TWA | Limited native features, less discoverability |

**Recommendation:** **React Native with Expo** - leverages existing JavaScript knowledge, quick iteration, and excellent ad integration support.

### 1.2 Project Structure
```
gundaata-mobile/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Game logic, helpers
│   ├── services/          # Ads, analytics, storage
│   ├── assets/            # Images, sounds, fonts
│   ├── constants/         # Theme, config values
│   └── __tests__/         # Test files
├── android/               # Native Android config
├── app.json               # Expo/RN config
└── package.json
```

### 1.3 Core Dependencies
- `react-native` / `expo`
- `react-native-google-mobile-ads` (AdMob)
- `@react-native-async-storage/async-storage`
- `react-native-sound` or `expo-av`
- `react-native-reanimated` (animations)
- `jest` + `@testing-library/react-native`

---

## Phase 2: Testing Infrastructure (SET UP FIRST)

> **This phase runs BEFORE writing any feature code. See [TESTING.md](./TESTING.md) for complete test specifications.**

### 2.1 Testing Stack Setup
- [ ] Install Jest + React Native Testing Library
- [ ] Install Detox or Maestro for E2E
- [ ] Configure test runners in package.json
- [ ] Set up test coverage thresholds (85% minimum)
- [ ] Configure CI/CD pipeline (GitHub Actions)

### 2.2 Write Core Logic Tests FIRST
Before implementing any game logic, write tests for:
- [ ] **Dice Module Tests** - rolling, validation, distribution
- [ ] **Betting Module Tests** - validation, limits, edge cases
- [ ] **Winnings Calculation Tests** - payouts, edge cases
- [ ] **Game State Tests** - reducer, transitions, game over

### 2.3 Write Component Tests FIRST
Before building UI components, write tests for:
- [ ] Dice component - rendering, animation states
- [ ] BetInput component - validation, quick bets
- [ ] GameOverModal - visibility, buttons, high score
- [ ] CashDisplay - formatting, updates

### 2.4 Test Coverage Requirements
| Category | Minimum |
|----------|---------|
| Core Game Logic | 95% |
| State Management | 90% |
| Components | 85% |
| Overall | 85% |

### 2.5 CI/CD Pipeline
- [ ] Automated tests on every PR
- [ ] Block merge if tests fail
- [ ] Coverage reports on PRs
- [ ] E2E tests on main branch

---

## Phase 3: Core Game Migration (TDD)

> Write failing tests → Implement → Refactor

### 3.1 Port Game Logic
- [ ] Extract pure game logic into separate utility functions
- [ ] Implement dice rolling mechanics
- [ ] Implement betting system
- [ ] Implement winnings calculation
- [ ] Implement game state management (Context API or Zustand)

### 2.2 Basic UI Components
- [ ] Dice component with images
- [ ] Bet input component
- [ ] Quick-bet buttons (+10, +50, +100, +500)
- [ ] Cash display
- [ ] Play/Roll button
- [ ] Game over modal

### 2.3 Storage
- [ ] Migrate localStorage to AsyncStorage
- [ ] Save high scores
- [ ] Save user preferences
- [ ] Save game state for resume

---

## Phase 4: UI/UX Enhancements

### 4.0 Real Gundaata Environment UI Revamp
- [ ] **Authentic Gundaata board layout** — replicate the real physical game's betting board
- [ ] **Traditional dice tray** — visual area where dice are thrown, styled after the real game
- [ ] **Bet placement areas** matching the real gundaata mat (numbered sections, coin stacks)
- [ ] **Dealer/house feel** — simulate the street-game atmosphere with appropriate colors, textures
- [ ] **Coin-based visuals** — show actual coin stacks instead of plain numbers for bets
- [ ] **Reference images** — gather real gundaata game photos for design accuracy

### 4.1 Visual Improvements
- [ ] **Modern Design System**
  - Gradient backgrounds (casino feel)
  - Glassmorphism cards for betting sections
  - Neumorphism buttons
  - Custom fonts (casino/retro style)

- [ ] **Enhanced Dice**
  - 3D dice models or high-quality sprites
  - Realistic rolling animations (Lottie or Reanimated)
  - Particle effects on wins
  - Glow effects on matching dice

- [ ] **Color Themes**
  - Classic Green (current)
  - Royal Purple
  - Midnight Blue
  - Gold Rush
  - Dark Mode

### 3.2 Animations & Feedback
- [ ] Dice shake animation before roll
- [ ] Coin burst animation on wins
- [ ] Screen shake on big wins
- [ ] Haptic feedback (vibration) on roll and win
- [ ] Confetti effect on new high score
- [ ] Smooth number counter animations for cash

### 3.3 Sound Design
- [ ] Multiple dice roll sound variations
- [ ] Win sound effects (small, medium, jackpot)
- [ ] Lose sound effect
- [ ] Background casino ambiance (optional, toggleable)
- [ ] Coin counting sounds
- [ ] Button tap sounds

### 3.4 Improved UX
- [ ] Onboarding tutorial (first-time users)
- [ ] Tooltips explaining game rules
- [ ] Bet confirmation for large bets
- [ ] Undo last bet button
- [ ] Quick "All In" button
- [ ] Swipe gestures for betting

---

## Phase 5: New Features

### 4.1 Daily Rewards System
- [ ] Daily login bonus (increasing streak rewards)
- [ ] Spin wheel for bonus cash
- [ ] Free starting cash every 4 hours
- [ ] Weekly challenges with rewards

### 4.2 Achievements & Progression
| Achievement | Criteria |
|-------------|----------|
| First Roll | Complete your first game |
| Lucky Seven | Win 7 times in a row |
| High Roller | Bet 500+ in single round |
| Millionaire | Reach 1,000,000 cash |
| Comeback Kid | Recover from <100 cash to 10,000+ |
| Risk Taker | Bet on all 6 numbers at once |
| Double Trouble | Both dice match your bet |
| Perfect Game | Win 10 rounds without losing |

### 4.3 Game Modes
- [ ] **Classic Mode** (current gameplay)
- [ ] **Timed Challenge** - Maximize winnings in 60 seconds
- [ ] **Survival Mode** - Start with 100, see how long you last
- [ ] **Daily Challenge** - Same seed for all players, compete on leaderboard
- [ ] **Multiplier Madness** - Random multipliers (2x, 5x, 10x) on rolls
- [ ] **Lucky Streak** - Consecutive wins increase payout multiplier

### 4.4 Social Features
- [ ] **Global Leaderboards**
  - Highest single game winnings
  - Highest all-time cash
  - Longest win streak
  - Weekly/Monthly rankings

- [ ] **Google Play Games Integration**
  - Achievements sync
  - Cloud save
  - Leaderboards

- [ ] **Share Features**
  - Share high scores to social media
  - Challenge friends
  - Screenshot with stats overlay

### 4.5 Customization
- [ ] **Dice Skins**
  - Classic white
  - Gold dice
  - Neon dice
  - Wooden dice
  - Crystal dice
  - Unlock via achievements or watch ads

- [ ] **Table Themes**
  - Vegas Casino
  - Indian Palace
  - Midnight Lounge
  - Beach Party

- [ ] **Avatar/Profile**
  - Choose avatar
  - Display name
  - Stats showcase

### 4.6 Statistics & History
- [ ] Detailed stats dashboard
  - Total games played
  - Win/loss ratio
  - Most profitable number
  - Biggest win
  - Average bet size
  - Lucky number (most wins)
- [ ] Game history log (last 50 games)
- [ ] Graphs showing cash over time

### 4.7 Responsible Gaming
- [ ] Session time reminders
- [ ] Daily loss limit settings
- [ ] "Take a break" suggestions
- [ ] Clear "virtual currency only" disclaimers

---

## Phase 6: Ad Integration

### 5.1 Ad Types & Placement

| Ad Type | Placement | Frequency |
|---------|-----------|-----------|
| **Banner** | Bottom of screen during gameplay | Always visible |
| **Interstitial** | After game over | Every 3rd game over |
| **Rewarded Video** | "Watch ad for bonus" button | On demand |
| **Rewarded Interstitial** | Offer after losing all cash | On game over |

### 5.2 Rewarded Ad Opportunities
- [ ] **Revive**: Watch ad to get 500 cash after game over
- [ ] **Double Down**: Watch ad to double your last winnings
- [ ] **Daily Bonus Multiplier**: Watch ad to 2x daily reward
- [ ] **Unlock Dice Skin**: Watch ad to unlock temporarily (24hr)
- [ ] **Extra Spin**: Watch ad for extra spin wheel try

### 5.3 Implementation
- [ ] Integrate Google AdMob SDK
- [ ] Set up ad units in AdMob console
- [ ] Implement ad loading and caching
- [ ] Handle ad failures gracefully
- [ ] Add "Remove Ads" IAP option ($2.99)
- [ ] Respect user's ad preferences
- [ ] GDPR consent dialog for EU users

### 5.4 Ad Frequency Balancing
- First 3 games: No interstitials (good first impression)
- Reduce ads for paying users
- Cap interstitials at 1 per 2 minutes
- Always give rewarded ad option before forced ads

---

## Phase 7: Play Store Preparation

> **Testing is covered in Phase 2 and [TESTING.md](./TESTING.md)**

### 7.1 App Store Assets
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (phone + tablet)
- [ ] Promotional video (30 seconds)
- [ ] App description (short + long)
- [ ] Keywords optimization

### 7.2 Technical Requirements
- [ ] Target SDK 34+ (Android 14)
- [ ] 64-bit support
- [ ] App signing with Play App Signing
- [ ] Privacy policy URL
- [ ] Data safety form completion
- [ ] Content rating questionnaire

### 7.3 Pre-launch Checklist
- [ ] Internal testing track
- [ ] Closed beta testing (50+ users)
- [ ] Open beta testing
- [ ] Crash-free rate > 99%
- [ ] ANR rate < 0.5%
- [ ] All critical bugs fixed

### 7.4 Legal & Compliance
- [ ] "Simulated Gambling" content rating
- [ ] Clear disclaimers (no real money)
- [ ] Terms of service
- [ ] Privacy policy (GDPR compliant)
- [ ] Age rating appropriate (likely Teen/12+)

---

## Phase 8: Post-Launch

### 8.1 Analytics & Monitoring
- [ ] Firebase Analytics events
- [ ] Crashlytics for crash reporting
- [ ] User retention tracking
- [ ] Ad revenue monitoring
- [ ] A/B testing framework

### 8.2 Planned Updates
- **v1.1**: Additional dice skins + bug fixes
- **v1.2**: New game mode (Timed Challenge)
- **v1.3**: Social features + leaderboards
- **v1.4**: Seasonal events (Diwali special, etc.)
- **v2.0**: Multiplayer mode

### 8.3 Monetization Targets
| Metric | Target |
|--------|--------|
| DAU | 10,000+ |
| Retention D1 | 40% |
| Retention D7 | 20% |
| ARPDAU | $0.05 |
| Ad eCPM | $5-10 |

---

## Timeline Estimate (TDD Approach)

| Phase | Description | Duration |
|-------|-------------|----------|
| Phase 1 | Platform & Architecture Setup | Week 1 |
| Phase 2 | **Testing Infrastructure (FIRST)** | Week 1-2 |
| Phase 3 | Core Game Migration (with tests) | Week 2-3 |
| Phase 4 | UI Enhancements (with tests) | Week 3-4 |
| Phase 5 | New Features (with tests) | Week 4-6 |
| Phase 6 | Ad Integration (with tests) | Week 6-7 |
| Phase 7 | Play Store Preparation | Week 7-8 |
| Phase 8 | Post-Launch | Ongoing |
| **Total to Launch** | | **~8 weeks** |

> Testing happens THROUGHOUT, not at the end. Each feature is test-driven.

---

## Priority Feature Recommendations

### Must-Have (MVP)
1. ✅ Core dice game functionality
2. ✅ Polished UI with animations
3. ✅ Sound effects & haptics
4. ✅ High score persistence
5. ✅ Rewarded ads for revival
6. ✅ Banner ads
7. ✅ Basic onboarding

### Should-Have (v1.0)
1. Daily rewards system
2. 5-10 achievements
3. Dice skin customization (3 skins)
4. Statistics dashboard
5. Google Play Games integration
6. Remove ads IAP

### Nice-to-Have (v1.x)
1. Additional game modes
2. Global leaderboards
3. Social sharing
4. Seasonal events
5. More customization options
6. Multiplayer (v2.0)

---

## Quick Wins (High Impact, Low Effort)

1. **Rewarded Ad Revival** - Huge retention boost
2. **Daily Login Bonus** - Increases DAU
3. **Haptic Feedback** - Feels more premium
4. **Win Animations** - Dopamine hit, more engagement
5. **Achievement Notifications** - Sense of progression
6. **Share High Score** - Free marketing

---

## Tech Stack Summary

```
Frontend:     React Native + Expo
State:        Zustand or Context API
Animations:   React Native Reanimated + Lottie
Ads:          Google AdMob
Analytics:    Firebase Analytics
Crashes:      Firebase Crashlytics
Storage:      AsyncStorage + Cloud Save
Backend:      Firebase (leaderboards, cloud save)
Testing:      Jest + RTL + Detox
CI/CD:        EAS Build + GitHub Actions
```

---

*This roadmap is a living document. Adjust priorities based on user feedback and analytics after launch.*
