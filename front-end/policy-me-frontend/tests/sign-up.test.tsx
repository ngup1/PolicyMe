/**
 * Sign Up Page Tests
 */

import { render, screen } from '@testing-library/react';
import SignUpPage from '../src/app/sign-up/[[...sign-up]]/page';

jest.mock('@clerk/nextjs', () => ({
  SignUp: () => <div data-testid="clerk-sign-up">Sign Up Form</div>,
}));

describe('Sign Up Page', () => {
  test('renders Clerk SignUp component', () => {
    render(<SignUpPage />);
    expect(screen.getByTestId('clerk-sign-up')).toBeInTheDocument();
  });

  test('displays sign up form', () => {
    render(<SignUpPage />);
    expect(screen.getByText('Sign Up Form')).toBeInTheDocument();
  });
});

