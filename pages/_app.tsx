import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { UserContextProvider } from "../contexts/UserContext";
function App({ Component, pageProps }: AppProps) {
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
          <Component {...pageProps} />
        </UserContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
