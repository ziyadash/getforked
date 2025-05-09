export default {
    preset: 'jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'babel-jest',
    },
    testMatch: ['**/tests/**/*.test.(ts|tsx)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  };
  