import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_mock_key'
process.env.CLERK_SECRET_KEY = 'sk_test_mock_key'
process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL = '/sign-in'
process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL = '/sign-up'
process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = '/'
process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = '/'

