import { Demographics } from "@/types";
import { createContext } from "react";
import { useState, useContext } from "react";
import { toast } from 'sonner';
import api from "@/api/axios";
import { toAppError, getErrorMessage } from "@/lib/error-handler";


export type UserContextType = {
  user: string | null;
  setUser: (val: string | null) => void;
  setDemographic: (val: Demographics) => void;

};

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);




  const setDemographic = async (val: Demographics) => {
    try {
      const response = await api.post("/auth/demographic", {...val});
      const data = response.data;
      toast.success(data.message || "Demographics saved successfully");
    }
    catch(error) {
      const appError = toAppError(error);
      console.error("Failed to save demographics:", appError);
      toast.error(getErrorMessage(appError));
      throw appError;
    }
  };

  return <UserContext.Provider value={{ user, setUser, setDemographic }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}