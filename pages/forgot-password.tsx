import { Heading, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import Head from "next/head";
import { UnauthenticatedGuard } from "@/components/auth/guards/UnauthenticatedGuard";

const captchaKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY ?? "";

const ForgotPasswordPage: NextPage = () => {
  return (
    <UnauthenticatedGuard>
      <Head>
        <title>Forgot Password - Maskr</title>
      </Head>
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
    </UnauthenticatedGuard>
  );
};
export default ForgotPasswordPage;
