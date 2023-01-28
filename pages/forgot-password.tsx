import { Heading, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm";
import { useUser } from "../hooks/useUser";

const captchaKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY ?? "";

const ForgotPasswordPage: NextPage = () => {
  const { isAuthenticated } = useUser();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  if (!mounted) return null;
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={captchaKey}
      scriptProps={{
        appendTo: "head",
      }}
    >
      <VStack minH={"100vh"} justify={"center"} spacing={8}>
        <Heading fontSize={"4xl"}>Reset your password</Heading>
        <ForgotPasswordForm />
      </VStack>
    </GoogleReCaptchaProvider>
  );
};
export default ForgotPasswordPage;
