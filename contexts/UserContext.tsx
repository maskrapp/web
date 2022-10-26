import { createContext, PropsWithChildren, useEffect, useState } from "react";

import { Token, TokenPair } from "../types";
import { pairSchema } from "../utils/zod";

interface UserContextType {
  isAuthenticated: boolean;
  accessToken: Token | null;
  refreshToken: Token | null;
  actions: {
    setAccessToken: (token: Token) => void;
    setRefreshToken: (token: Token) => void;
    signIn: (pair: TokenPair) => void;
  };
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [refreshToken, setRefreshToken] = useState<Token | null>(null);
  const [accessToken, setAccessToken] = useState<Token | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  const signOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setAuthenticated(false);
  };
  useEffect(() => {
    window.onstorage = (e) => {
      try {
        if (e.key === "tokens") {
          if (!e.newValue) signOut();
          const data: TokenPair = JSON.parse(e.newValue ?? "{}");
          const { success } = pairSchema.safeParse(data);
          if (success) {
            setRefreshToken(data.refresh_token);
            setAccessToken(data.access_token);
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
    const tokens = localStorage.getItem("tokens");
    if (!tokens) return;
    try {
      const data: TokenPair = JSON.parse(tokens);
      const { success } = pairSchema.safeParse(data);
      if (success) {
        setRefreshToken(data.refresh_token);
        setAccessToken(data.access_token);
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
        setAccessToken(pair.access_token);
        setRefreshToken(pair.refresh_token);
        setAuthenticated(true);
      },
    },
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
