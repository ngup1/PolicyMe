/**
 * Middleware Tests - Clerk Route Protection
 */

jest.mock('@clerk/nextjs/server', () => ({
  clerkMiddleware: (handler: any) => handler,
  createRouteMatcher: (routes: string[]) => {
    return (request: any) => {
      const path = request.nextUrl?.pathname || '';
      return routes.some(route => {
        const pattern = route.replace('(.*)', '');
        return path.startsWith(pattern);
      });
    };
  },
}));

describe('Clerk Middleware', () => {
  let mockAuth: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockAuth = {
      protect: jest.fn(),
      userId: 'user_123',
    };
  });

  test('protects the home route', async () => {
    const middleware = require('../src/middleware').default;
    const mockRequest = {
      nextUrl: { pathname: '/' },
      url: 'http://localhost:3000/',
    } as any;

    await middleware(mockAuth, mockRequest);
    expect(mockAuth.protect).toHaveBeenCalled();
  });

  test('allows sign-in page without authentication', async () => {
    const middleware = require('../src/middleware').default;
    const mockRequest = {
      nextUrl: { pathname: '/sign-in' },
      url: 'http://localhost:3000/sign-in',
    } as any;

    await middleware(mockAuth, mockRequest);
    expect(mockAuth.protect).not.toHaveBeenCalled();
  });

  test('allows sign-up page without authentication', async () => {
    const middleware = require('../src/middleware').default;
    const mockRequest = {
      nextUrl: { pathname: '/sign-up' },
      url: 'http://localhost:3000/sign-up',
    } as any;

    await middleware(mockAuth, mockRequest);
    expect(mockAuth.protect).not.toHaveBeenCalled();
  });
});

