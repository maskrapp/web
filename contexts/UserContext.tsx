import { createContext, PropsWithChildren, useEffect, useState } from "react";

import { AuthProvider, TokenPair } from "../types";
import { tokenSchema } from "@/utils/zod";
import jwt_decode from "jwt-decode";

interface UserContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  provider: AuthProvider | null;
  actions: {
    setAccessToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    signIn: (pair: TokenPair) => void;
  };
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [provider, setProvider] = useState<AuthProvider | null>(null);

  useEffect(() => {
    try {
      const access_token = localStorage.getItem("access_token");
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token || !access_token) return;
      const accessTokenResult = tokenSchema.safeParse(access_token);
      const refreshTokenResult = tokenSchema.safeParse(refresh_token);
      if (accessTokenResult.success && refreshTokenResult.success) {
        const decoded = jwt_decode<{ provider: string; exp: number }>(
          refresh_token
        );
        const hasExpired = Date.now() / 1000 > decoded.exp;
        if (!hasExpired) {
          setRefreshToken(refresh_token);
          setAccessToken(access_token);
          setProvider(decoded.provider as AuthProvider);
          setAuthenticated(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: UserContextType = {
    isLoading: loading,
    isAuthenticated: authenticated,
    accessToken: accessToken,
    refreshToken: refreshToken,
    provider: provider,
    actions: {
      setAccessToken: (token) => {
        setAccessToken(token);
      },
      setRefreshToken: (token) => {
        setRefreshToken(token);
      },
      signIn: (pair) => {
        setRefreshToken(pair.refresh_token.token);
        setAccessToken(pair.access_token.token);
        setAuthenticated(true);
        setProvider(pair.refresh_token.provider as AuthProvider);
      },
    },
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
