import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { SignUp } from "../components/auth/Signup";
import { useUser } from "../hooks/useUser";

const SignUpPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useUser();
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
        <Flex id="flex" minH={"100vh"} align={"center"} justify={"center"}>
          <SignUp />
        </Flex>
      </GoogleReCaptchaProvider>
    );
  }
  return null;
};

export default SignUpPage;
