import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Signin } from "../components/auth/Signin";
import { useUser } from "../hooks/useUser";

const SignInPage: NextPage = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  if (mounted) {
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
  }
  return null;
};
export default SignInPage;
