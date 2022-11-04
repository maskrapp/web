import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { SignUp } from "../components/auth/Signup";
import { useUser } from "../hooks/useUser";

// const reCaptchaKey =
//   process.env.RECAPTCHA_KEY ?? "6LdEGNAiAAAAAEw7lkQqaRlOZgto6N2mMp0_wu2D";

const SignUpPage: NextPage = () => {
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
      <Flex id="flex" minH={"100vh"} align={"center"} justify={"center"}>
        <SignUp />
      </Flex>
    </GoogleReCaptchaProvider>
  );
};

export default SignUpPage;
