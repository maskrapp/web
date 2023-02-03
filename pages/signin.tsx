import {
  Heading,
  Link as ChakraLink,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { SigninForm } from "@/components/auth/SigninForm";
import { useUser } from "@/hooks/useUser";

const captchaKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY ?? "";

const SignInPage: NextPage = () => {
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
    );
  }
  return null;
};
export default SignInPage;
