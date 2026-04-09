"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authApi, TokenResponse } from "./api";

interface AuthUser {
  token: string;
  user_id: string;
  role: "student" | "parent";
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: "student" | "parent"
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");
      const user_id = localStorage.getItem("user_id");
      const role = localStorage.getItem("user_role") as "student" | "parent" | null;
      const name = localStorage.getItem("user_name");
      if (token && user_id && role && name) {
        setUser({ token, user_id, role, name });
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const persist = (data: TokenResponse) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("user_role", data.role);
    localStorage.setItem("user_name", data.name);
    setUser({
      token: data.access_token,
      user_id: data.user_id,
      role: data.role,
      name: data.name,
    });
  };

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    persist(data);
    router.push(data.role === "student" ? "/dashboard/student" : "/dashboard/parent");
  }, [router]);

  const signup = useCallback(
    async (name: string, email: string, password: string, role: "student" | "parent") => {
      const data = await authApi.signup({ name, email, password, role });
      persist(data);
      router.push(role === "student" ? "/dashboard/student/profile" : "/dashboard/parent");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
