// Mock for react-native-reanimated
module.exports = {
  default: {
    call: () => {},
  },
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((value) => value),
  withSpring: jest.fn((value) => value),
  withSequence: jest.fn((...values) => values[0]),
  withDelay: jest.fn((_, value) => value),
  withRepeat: jest.fn((value) => value),
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    bezier: jest.fn(),
  },
  runOnJS: jest.fn((fn) => fn),
  runOnUI: jest.fn((fn) => fn),
};
