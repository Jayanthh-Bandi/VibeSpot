import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/auth";
import { disconnectSocket } from "../services/socketService";
import { getCurrentUser } from "../services/authService";
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (token: string, user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   let mounted = true;
   const storedToken = localStorage.getItem("token");
   const storedUser = localStorage.getItem("user");

   const restoreSession = async () => {
     if (!storedToken || !storedUser || storedUser === "undefined") {
       if (mounted) setLoading(false);
       return;
     }

     try {
       const response = await getCurrentUser();
       if (!mounted) return;
       setToken(storedToken);
       setUser(response.user);
       localStorage.setItem("user", JSON.stringify(response.user));
     } catch {
       localStorage.removeItem("token");
       localStorage.removeItem("user");
       disconnectSocket();
     } finally {
       if (mounted) setLoading(false);
     }
   };

   restoreSession();

   return () => {
     mounted = false;
   };
 }, []);

 const login = (newToken: string, newUser: User) => {
  localStorage.setItem("token", newToken);
  localStorage.setItem("user", JSON.stringify(newUser));

  setToken(newToken);
  setUser(newUser);

};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  disconnectSocket();
    setToken(null);
    setUser(null);
  };

  const updateUser = (newUser: User) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      updateUser,
      logout,
      isAuthenticated: !!token,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}