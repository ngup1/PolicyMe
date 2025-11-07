/**
 * Sign In Page Tests
 */

import { render, screen } from '@testing-library/react';
import SignInPage from '../src/app/sign-in/[[...sign-in]]/page';

jest.mock('@clerk/nextjs', () => ({
  SignIn: () => <div data-testid="clerk-sign-in">Sign In Form</div>,
}));

describe('Sign In Page', () => {
  test('renders Clerk SignIn component', () => {
    render(<SignInPage />);
    expect(screen.getByTestId('clerk-sign-in')).toBeInTheDocument();
  });

  test('displays sign in form', () => {
    render(<SignInPage />);
    expect(screen.getByText('Sign In Form')).toBeInTheDocument();
  });
});

