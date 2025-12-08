import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User, LoginRequest } from "@/types"; 
import api from "@/api/axios";

export type AuthContextType = {
    user: User | null;
    jwtToken: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}


export const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {



    const [user, setUser] = useState<User | null>(null);
    const [jwtToken, setJwtToken] = useState<string | null>(null); 




    useEffect(() => {
        if (jwtToken){
            localStorage.setItem("jwtToken", jwtToken);
        }
        else{
            localStorage.removeItem("jwtToken");
        }
    }, [jwtToken]);
    
    
    const login = async (credentials : LoginRequest) => {
        try {
            const response = await api.post("/auth/login/", { ...credentials});
            const data = response.data;

            setUser(data.user);
            setJwtToken(data.token);

        } catch (error) { //need better error handling here
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setJwtToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, jwtToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

