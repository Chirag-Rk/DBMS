import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

type UserRole = "admin" | "guide" | "student";

interface User {
  user_id: number;
  full_name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  setUser: any;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  // 🔥 Load user from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user_data");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
