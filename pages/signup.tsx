import {
  Heading,
  Link,
  Link as ChakraLink,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { SignUpForm } from "@/components/auth/SignupForm";
import { useUser } from "@/hooks/useUser";
import Head from "next/head";

const captchaKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY ?? "";

const SignUpPage: NextPage = () => {
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

  if (mounted) {
    return (
      <>
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
      </>
    );
  }
  return null;
};

export default SignUpPage;
