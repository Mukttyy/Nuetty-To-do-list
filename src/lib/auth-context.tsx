"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
}

interface AuthResult {
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();
  const sessionUser = session.data?.user;

  const user = React.useMemo<AuthUser | null>(() => {
    if (!sessionUser) return null;
    return {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      initials: sessionUser.name.trim().charAt(0).toUpperCase() || "U",
    };
  }, [sessionUser]);

  const signIn = React.useCallback(async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    return { error: result.error?.message };
  }, []);

  const signUp = React.useCallback(
    async (name: string, email: string, password: string) => {
      const result = await authClient.signUp.email({ name, email, password });
      return { error: result.error?.message };
    },
    []
  );

  const logout = React.useCallback(async () => {
    const result = await authClient.signOut();
    return { error: result.error?.message };
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading: session.isPending,
      signIn,
      signUp,
      logout,
    }),
    [user, session.isPending, signIn, signUp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
