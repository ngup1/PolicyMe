# Clerk Authentication Setup Guide

## Overview
Clerk authentication has been integrated into your PolicyMe application. This guide will help you complete the setup.

## What's Been Implemented

✅ **Clerk Package Installed**: `@clerk/nextjs` has been added to your project  
✅ **ClerkProvider**: Your app is now wrapped with the Clerk authentication provider  
✅ **Middleware**: Protected routes configuration is in place  
✅ **Sign In/Sign Up Pages**: Authentication pages created at `/sign-in` and `/sign-up`  
✅ **Header Component**: Updated with Sign In, Sign Up buttons, and User profile menu  

## Setup Steps

### 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application in the Clerk Dashboard

### 2. Get Your API Keys

1. In your Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** and **Secret Key**

### 3. Configure Environment Variables

1. Create a `.env.local` file in the `front-end/policy-me-frontend/` directory:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and add your Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# These are already configured:
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Restart Your Dev Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## Features Available

### For Signed Out Users:
- **Sign In Button**: Opens authentication modal
- **Sign Up Button**: Opens registration modal
- Browse public content (if any routes are public)

### For Signed In Users:
- **User Button**: Profile avatar with dropdown menu
  - Manage account settings
  - Sign out
  - View profile
- Access to protected routes and content
- Ability to save preferences and data to their profile

## Route Protection

The middleware is configured to protect all routes except:
- `/sign-in/*`
- `/sign-up/*`

To make routes public, update the `isPublicRoute` matcher in `src/middleware.ts`:

```typescript
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/',              // Make homepage public
  '/about(.*)',     // Make about page public
])
```

## Customization

### Styling the Clerk Components

The Clerk components inherit your app's theme by default. To customize further:

1. Use the `appearance` prop on Clerk components
2. Add custom CSS in your `globals.css`
3. Configure theme in the Clerk Dashboard

### Example Customization:

```tsx
<UserButton 
  appearance={{
    elements: {
      avatarBox: "w-10 h-10",
      userButtonPopoverCard: "shadow-xl"
    },
    variables: {
      colorPrimary: "#your-color"
    }
  }}
/>
```

## Next Steps

Once Clerk is configured, you can:

1. **Add User Profile Data**: Store user preferences, saved policies, etc.
2. **Implement User-Specific Features**: 
   - Save favorite policies
   - Track search history
   - Create custom policy collections
3. **Set up Organization Support**: Allow teams to share policy data
4. **Add Role-Based Access Control**: Different permissions for different user types

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk + Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)

## Troubleshooting

### "Missing publishableKey" Error
- Make sure `.env.local` exists and contains your keys
- Restart the dev server after adding environment variables

### Middleware Not Working
- Ensure `middleware.ts` is in the `src/` directory (not `src/app/`)
- Check that the file export is correct

### Sign In Modal Not Appearing
- Verify your Clerk keys are correct
- Check browser console for errors
- Ensure you're using `mode="modal"` on SignInButton/SignUpButton

## Support

If you encounter issues:
1. Check the [Clerk Discord](https://clerk.com/discord)
2. Review [Clerk GitHub Issues](https://github.com/clerk/javascript)
3. Consult the [Clerk Documentation](https://clerk.com/docs)

