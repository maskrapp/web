import { Button, Center, Text } from "@chakra-ui/react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "@/hooks/useUser";
import { TokenPair } from "@/types";
import { googleSignin } from "@/api/auth";

const CLIENTID = process.env.NEXT_PUBLIC_GOOGLE_CLIENTID ?? "";

export const GoogleSignin = () => {
  return (
    <GoogleOAuthProvider clientId={CLIENTID}>
      <Signin />
    </GoogleOAuthProvider>
  );
};

const Signin = () => {
  const { actions } = useUser();
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    onSuccess: async (codeResponse) => {
      const response = await googleSignin(axios, codeResponse.code);
      const tokens: TokenPair = response.data;
      localStorage.setItem("access_token", tokens.access_token.token);
      localStorage.setItem("refresh_token", tokens.refresh_token.token);
      actions.signIn(tokens);
    },
    onError: (err) => {
      console.log("Google Login error:", err);
    },
  });
  return (
    <Button
      w={"full"}
      maxW={"md"}
      variant={"outline"}
      leftIcon={<FcGoogle />}
      onClick={() => login()}
    >
      <Center>
        <Text>Sign in with Google</Text>
      </Center>
    </Button>
  );
};
