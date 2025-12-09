import { Demographic } from "@/types";
import { totalmem } from "os";
import { createContext } from "react";
import { useState, useContext } from "react";
import { API_BASE_URL } from "@/constants";
import { toast } from 'sonner';
import api from "@/api/axios";


export type UserContextType = {
  user: string | null;
  setUser: (val: string | null) => void;
  setDemographic: (val: Demographic) => void;

};

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);




  const setDemographic = async (val: Demographic) => {
    try{
      const response = await api.post("/auth/demographic", {...val});
      const data = response.data;
      toast.success(data.message)
    }
    catch(error) {
      console.error(error);
      throw error;
    }

  };

  return <UserContext.Provider value={{ user, setUser, setDemographic }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}