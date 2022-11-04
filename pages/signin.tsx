import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Signin } from "../components/auth/Signin";
import { useUser } from "../hooks/useUser";

const SignInPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  if (isAuthenticated) {
    router.push("/");
    return null;
  }
  const captchaKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY ?? "";
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={captchaKey}
      scriptProps={{
        appendTo: "head",
      }}
    >
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Signin />
      </Flex>
    </GoogleReCaptchaProvider>
  );
};
export default SignInPage;
