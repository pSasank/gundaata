/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest for pure TypeScript unit tests
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/unit/**/*.test.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'src/utils/**/*.ts',
    'src/state/**/*.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  // Don't transform node_modules
  transformIgnorePatterns: ['node_modules/'],
  // Clear mocks between tests
  clearMocks: true,
};
