import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/auth";
import { connectSocket, disconnectSocket } from "../services/socketService";
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (token: string, user: User) => void;
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
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

if (storedToken && storedUser && storedUser !== "undefined") {
  try {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  } catch (error) {
    console.error("Invalid user in localStorage", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

setLoading(false);

    setLoading(false);
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

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
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