import {
  Heading,
  Link as ChakraLink,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { SignUpForm } from "@/components/auth/SignupForm";
import Head from "next/head";
import { UnauthenticatedGuard } from "@/components/auth/guards/UnauthenticatedGuard";
import Link from "next/link";

const captchaKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY ?? "";

const SignUpPage: NextPage = () => {
  return (
    <UnauthenticatedGuard>
      <Head>
        <title>Sign up - Maskr</title>
      </Head>
      <GoogleReCaptchaProvider
        reCaptchaKey={captchaKey}
        scriptProps={{
          appendTo: "head",
        }}
      >
        <VStack minH={"100vh"} justify={"center"} spacing={8}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create an account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              Already have an account?{" "}
              <Link href="/signin">
                <ChakraLink color={"blue.400"}>Sign in here</ChakraLink>
              </Link>
            </Text>
          </Stack>
          <SignUpForm />
        </VStack>
      </GoogleReCaptchaProvider>
    </UnauthenticatedGuard>
  );
};

export default SignUpPage;
