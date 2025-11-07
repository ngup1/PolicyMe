/**
 * Header Component Tests - Clerk Authentication
 */

import { render, screen } from '@testing-library/react';
import Header from '../src/components/layout/Header';

jest.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children, mode }: any) => (
    <div data-testid="sign-in-button" data-mode={mode}>
      {children}
    </div>
  ),
  SignUpButton: ({ children, mode }: any) => (
    <div data-testid="sign-up-button" data-mode={mode}>
      {children}
    </div>
  ),
  UserButton: () => <div data-testid="user-button">User Menu</div>,
  SignedIn: ({ children }: any) => {
    const isSignedIn = process.env.TEST_SIGNED_IN === 'true';
    return isSignedIn ? <>{children}</> : null;
  },
  SignedOut: ({ children }: any) => {
    const isSignedIn = process.env.TEST_SIGNED_IN === 'true';
    return !isSignedIn ? <>{children}</> : null;
  },
}));

describe('Header Component - Authentication', () => {
  beforeEach(() => {
    delete process.env.TEST_SIGNED_IN;
  });

  test('shows sign in and sign up buttons when signed out', () => {
    process.env.TEST_SIGNED_IN = 'false';
    render(<Header />);

    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-up-button')).toBeInTheDocument();
    expect(screen.queryByTestId('user-button')).not.toBeInTheDocument();
  });

  test('shows user button when signed in', () => {
    process.env.TEST_SIGNED_IN = 'true';
    render(<Header />);

    expect(screen.getByTestId('user-button')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sign-up-button')).not.toBeInTheDocument();
  });

  test('sign in button uses modal mode', () => {
    process.env.TEST_SIGNED_IN = 'false';
    render(<Header />);

    const signInButton = screen.getByTestId('sign-in-button');
    expect(signInButton).toHaveAttribute('data-mode', 'modal');
  });

  test('sign up button uses modal mode', () => {
    process.env.TEST_SIGNED_IN = 'false';
    render(<Header />);

    const signUpButton = screen.getByTestId('sign-up-button');
    expect(signUpButton).toHaveAttribute('data-mode', 'modal');
  });
});

