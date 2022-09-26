import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserContextProvider } from "../context/UserContext";
function App({ Component, pageProps }: AppProps) {
  //TODO: this is a bad fix for next's text mismatch, fix this later.
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return null;

  const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
  };
  const theme = extendTheme({ config });

  if (router.asPath.startsWith("/app")) {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
    );

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    });

    return (
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <UserContextProvider supabaseClient={supabaseClient}>
            <Component {...pageProps} />
          </UserContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
