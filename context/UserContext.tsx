import { Session, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { UserDetails } from "../types/user";

type UserContextType = {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  supabase: SupabaseClient;
  userDetails: UserDetails | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  supabaseClient: SupabaseClient;
}

export const UserContextProvider = ({
  supabaseClient,
  children,
}: React.PropsWithChildren<Props>) => {
  const [isLoadingData, setIsloadingData] = useState(false);
  const [session, setSession] = useState<Session | null>(
    supabaseClient.auth.session()
  );
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  useEffect(() => {
    const { data } = supabaseClient.auth.onAuthStateChange((ev, session) => {
      setSession(session);
    });
    window.onstorage = (e) => {
      if (e.key === "supabase.auth.token") {
        const newSession = JSON.parse(e.newValue ?? "{}");
        setSession(newSession?.currentSession);
      }
    };
    return () => {
      data?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      setIsloadingData(true);
      const response = await supabaseClient
        .from<UserDetails>("users")
        .select("*")
        .single();
      if (response.status === 200) {
        setUserDetails(response.data);
      } else {
        console.log("postgrest error:", response);
      }
      setIsloadingData(false);
    };
    getUserDetails();
  }, []);

  const value = {
    isAuthenticated: !!session?.user,
    session: session,
    isLoading: isLoadingData,
    supabase: supabaseClient,
    userDetails: userDetails,
  } as UserContextType;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserContextProvider");
  }
  return context;
};
