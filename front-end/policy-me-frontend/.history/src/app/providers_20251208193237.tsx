import { AuthProvider } from "@/context/AuthProvider";
import { UserProvider } from "@/context/UserProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </AuthProvider>
  );
}
