import { Button, Center, Text } from "@chakra-ui/react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../../../context/UserContext";
import { TokenPair } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";
import { pairSchema } from "../../../utils/zod";

const exchangeData = async (code: string) => {
  return axios.post(`${BACKEND_URL}/auth/google`, { code });
};

export const GoogleSignin = () => {
  return (
    <GoogleOAuthProvider
      clientId={
        "900187075817-88osmcnnf42dqr54q5kk2t13ek20doai.apps.googleusercontent.com"
      }
    >
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
      const response = await exchangeData(codeResponse.code);
      const data: TokenPair = response.data;
      const { success } = pairSchema.safeParse(data);
      if (success) {
        localStorage.setItem("tokens", JSON.stringify(data));
        actions.signIn(data);
      }
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
