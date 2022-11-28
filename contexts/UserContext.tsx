import { createContext, PropsWithChildren, useEffect, useState } from "react";

import { TokenPair } from "../types";
import { tokenSchema } from "../utils/zod";

interface UserContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
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
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  const signOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setAuthenticated(false);
  };
  useEffect(() => {
    window.onstorage = (e) => {
      try {
        if (e.key === "refresh_token") {
          if (!e.newValue) signOut();
          const { success } = tokenSchema.safeParse(e.newValue);
          if (success) {
            setRefreshToken(e.newValue);
            setAuthenticated(true);
          } else {
            signOut();
          }
        }
      } catch {
        signOut();
      }
    };
    return () => {
      window.onstorage = null;
    };
  }, []);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token || !access_token) return;
    try {
      const accessTokenResult = tokenSchema.safeParse(access_token);
      const refreshTokenResult = tokenSchema.safeParse(refresh_token);
      if (accessTokenResult.success && refreshTokenResult.success) {
        setRefreshToken(refresh_token);
        setAccessToken(access_token);
        setAuthenticated(true);
      }
    } catch {}
  }, []);

  const value: UserContextType = {
    isAuthenticated: authenticated,
    accessToken: accessToken,
    refreshToken: refreshToken,
    actions: {
      setAccessToken: (token) => {
        setAccessToken(token);
      },
      setRefreshToken: (token) => {
        setRefreshToken(token);
      },
      signIn: (pair) => {
        setAccessToken(pair.access_token.token);
        setRefreshToken(pair.refresh_token.token);
        setAuthenticated(true);
      },
    },
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
