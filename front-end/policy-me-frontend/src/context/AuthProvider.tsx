import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User, LoginRequest, SignUpRequest } from "@/types"; 
import api from "@/api/axios";
import { API_BASE_URL } from "@/constants";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { toAppError, getErrorMessage, UnauthorizedError } from "@/lib/error-handler";

export type AuthContextType = {
    user: User | null;
    jwtToken: string | null;
    logIn: (credentials: LoginRequest) => Promise<void>;
    logOut: () => void;
    logInViaOAuth2: () => void;
    signUp: (credentials : SignUpRequest) => Promise<void>;
    setJwtToken : (token : string) => void;
    formatDate : (dateString : string) => String;
}


export const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {


    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [jwtToken, setJwtToken] = useState<string | null>(null); 
    console.log(user);



useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get("token");
  const tokenFromStorage = localStorage.getItem("jwtToken");

  const token = tokenFromUrl ?? tokenFromStorage;

  if (token) {
    setJwtToken(token);
    localStorage.setItem("jwtToken", token);
  }

  if (tokenFromUrl) {
    window.history.replaceState({}, "", "/");
    router.push('/'); // optional: maybe delay until after user is fetched
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // router is stable from next/navigation, no need to include in deps




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
                if (data.token && data.token != jwtToken){
                    setJwtToken(data.token);
                }
            }
            catch(error){
                const appError = toAppError(error);
                console.error("Failed to fetch user info:", appError);
                
                // If unauthorized, clear token and user
                if (appError instanceof UnauthorizedError) {
                    setUser(null);
                    setJwtToken(null);
                    localStorage.removeItem("jwtToken");
                } else {
                    // For other errors, just log but don't clear user
                    // User might still be valid, just couldn't refresh
                    console.warn("Could not refresh user info:", getErrorMessage(appError));
                }
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
            toast.success(data.message || "Login successful");

        } catch (error) {
            const appError = toAppError(error);
            console.error("Login error:", appError);
            
            // Don't show toast here - let the component handle it
            // This allows components to show custom error messages
            throw appError;
        }
    };


    //wrapper
    const logInViaOAuth2 = () => {
        window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;

    };
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };



    //logout
    const logOut = () => {
        toast.loading("Logging out...");
        localStorage.removeItem("jwtToken");
        setUser(null);
        setJwtToken(null);
        router.push('/');
    };


    //standard signup
    const signUp = async (credentials : SignUpRequest) => {
        try {
            const response = await api.post("/auth/signup", { ...credentials});
            const data = response.data;

            setUser(data.user);
            setJwtToken(data.token);
            toast.success(data.message || "Account created successfully");

        } catch (error) {
            const appError = toAppError(error);
            console.error("Signup error:", appError);
            
            // Don't show toast here - let the component handle it
            throw appError;
        }
    }


    return (
        <AuthContext.Provider value={{ user, jwtToken, logIn, logOut, signUp, logInViaOAuth2, setJwtToken, formatDate }}>
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