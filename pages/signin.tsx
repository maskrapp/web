import {
  Heading,
  Link as ChakraLink,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { SigninForm } from "@/components/auth/SigninForm";
import Head from "next/head";
import { UnauthenticatedGuard } from "@/components/auth/guards/UnauthenticatedGuard";

const captchaKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY ?? "";

const SignInPage: NextPage = () => {
  return (
    <UnauthenticatedGuard>
      <Head>
        <title>Sign in - Maskr</title>
      </Head>
      <GoogleReCaptchaProvider
        reCaptchaKey={captchaKey}
        scriptProps={{
          appendTo: "head",
        }}
      >
        <VStack minH={"100vh"} justify={"center"} spacing={8}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign="center">
              Sign in to your account
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              Don&apos;t have an account?{" "}
              <Link href="/signup">
                <ChakraLink color={"blue.400"}>Create one here</ChakraLink>
              </Link>
            </Text>
          </Stack>
          <SigninForm />
        </VStack>
      </GoogleReCaptchaProvider>
    </UnauthenticatedGuard>
  );
};
export default SignInPage;
