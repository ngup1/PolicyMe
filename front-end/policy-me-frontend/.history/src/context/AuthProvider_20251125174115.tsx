import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User, LoginRequest, SignUpRequest } from "@/types"; 
import api from "@/api/axios";
import { API_BASE_URL } from "@/constants";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export type AuthContextType = {
    user: User | null;
    jwtToken: string | null;
    logIn: (credentials: LoginRequest) => Promise<void>;
    logOut: () => void;
    logInViaOAuth2: () => void;
    signUp: (credentials : SignUpRequest) => Promise<void>;
    setJwtToken : (token : string) => void;
}


export const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {


    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [jwtToken, setJwtToken] = useState<string | null>(null); 



    //after redirect for oauth2 we need to get the token

    useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if(token){
        setJwtToken(token);          // store in state & localStorage
        window.history.replaceState({}, "", "/"); // remove token from URL
        router.push('/');
    }
}, []);



    useEffect(() => {
        if(!jwtToken || user){
            return;
        }
        const fetchUser = async () =>{
            try{
                const response = await api.get('/auth/me', {
                    headers: {Authorization : `Bearer ${jwtToken}`},
                });
                const data = response.data;
                setUser(data.user);
                setJwtToken(data.token);
                toast.success(data.message);

            }
            catch(error){
                console.error("failed to fetch user info", error);
                setUser(null);

            }

        };
        fetchUser();
    }, [jwtToken])



    //sets the jwtToken to local Storage
    useEffect(() => {
        if (jwtToken){
            localStorage.setItem("jwtToken", jwtToken);
        }
        else{
            localStorage.removeItem("jwtToken");
        }
    }, [jwtToken]);
    
    


    //standard login
    const logIn = async (credentials : LoginRequest) => {
        try {
            const response = await api.post("/auth/login", { ...credentials});
            const data = response.data;

            setUser(data.user);
            setJwtToken(data.token);
            toast.success(data.message);

        } catch (error) { //need better error handling here
            console.error(error);
            throw error;
        }
    };


    //wrapper
    const logInViaOAuth2 = () => {
        window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;

    };


    //logout
    const logOut = () => {
        setUser(null);
        setJwtToken(null);
    };


    //standard signup
    const signUp = async (credentials : SignUpRequest) => {
        try {
            const response = await api.post("/auth/signup", { ...credentials});
            const data = response.data;

            setUser(data.user);
            setJwtToken(data.token);

            toast.success(data.message);

        } catch (error) { //need better error handling here
            console.error(error);
            throw error;
        }
    }


    return (
        <AuthContext.Provider value={{ user, jwtToken, logIn, logOut, signUp, logInViaOAuth2, setJwtToken }}>
            {children}
        </AuthContext.Provider>
    );
}


    export function useAuth(){
        const context = useContext(AuthContext);
          if (!context) {
            throw new Error("useAuth must be used within an AuthProvider");
        }
        return context;
    };

