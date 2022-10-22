import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ModalContextProvider } from "../context/ModalContext";
import { UserContextProvider } from "../context/UserContext";
function App({ Component, pageProps }: AppProps) {
  //TODO: this is a bad fix for next's text mismatch, fix this later.
  const [loading, setLoading] = useState(true);

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

  const theme = extendTheme({
    config,
    styles: {
      global: () => ({
        bg: "",
      }),
    },
  });

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
          <ModalContextProvider>
            <Component {...pageProps} />
          </ModalContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
