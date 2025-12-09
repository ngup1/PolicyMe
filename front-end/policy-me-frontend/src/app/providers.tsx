"use client"

import { AuthProvider } from "@/context/AuthProvider";
import { UserProvider } from "@/context/UserProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
