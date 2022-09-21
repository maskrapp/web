import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
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
    console.log("rendering app...");
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
    );

    return (
      <ChakraProvider theme={theme}>
        <UserContextProvider supabaseClient={supabaseClient}>
          <Component {...pageProps} />
        </UserContextProvider>
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
