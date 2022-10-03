import { ChakraProvider, extendTheme } from "@chakra-ui/react";
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
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024",
      xl: "1280",
      "2xl": "1536px",
    },
  };
  const theme = extendTheme({ config });

  if (router.asPath.startsWith("/app")) {
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
          <UserContextProvider>
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
