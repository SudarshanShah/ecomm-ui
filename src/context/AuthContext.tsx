/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import React, { createContext, useContext, useState, useEffect } from "react";
// import {jwtDecode} from "jwt-decode";

interface AuthContextType {
  token: string | null;
  groups?: string[];
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("token"));
  const [groups, setGroups] = useState<string[]>(
    () => {
      const stored = sessionStorage.getItem("token");
      if (stored) {
        const decoded: any = JSON.parse(atob(stored.split(".")[1])); // decode payload
        return decoded["cognito:groups"] || [];
      }
      return [];
    }
  );

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        if (token) {
          setToken(token);
        }
      } catch {
        setToken(null);
      }
    }
    loadSession();
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    sessionStorage.setItem("token", newToken);
    try {
      const decoded: any = JSON.parse(atob(newToken.split(".")[1]));
      setGroups(decoded["cognito:groups"] || []);
    } catch {
      setGroups([]);
    }
  };

  const logout = async () => {
    await signOut();
    setToken(null);
    setGroups([]);
    sessionStorage.removeItem("token");
  };

  // Sync state if token already exists in storage
  useEffect(() => {
    const stored = sessionStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, groups }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
