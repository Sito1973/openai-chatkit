import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setState({
          isLoading: false,
          isAuthenticated: data.authenticated,
          user: data.user || null,
          error: null,
        });
      } else {
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: null,
        });
      }
    } catch (error) {
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: "Failed to check authentication",
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(() => {
    window.location.href = "/auth/login/google";
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    refresh: checkAuth,
  };
}
