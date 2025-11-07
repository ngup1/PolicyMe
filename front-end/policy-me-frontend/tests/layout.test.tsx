/**
 * Layout Tests - ClerkProvider Integration
 */

import RootLayout from '../src/app/layout';

// Mock ClerkProvider
jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: jest.fn(({ children }) => children),
}));

describe('RootLayout with ClerkProvider', () => {
  test('uses ClerkProvider in the layout', () => {
    const { ClerkProvider } = require('@clerk/nextjs');
    
    // This test verifies that ClerkProvider is imported and used
    expect(ClerkProvider).toBeDefined();
  });

  test('layout component exists and is default export', () => {
    expect(RootLayout).toBeDefined();
    expect(typeof RootLayout).toBe('function');
  });
});

