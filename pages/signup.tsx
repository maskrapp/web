import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { SignUp } from "../components/auth/Signup";
import { useUser } from "../hooks/useUser";

const SignUpPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  if (isAuthenticated) {
    router.push("/");
    return null;
  }
  return (
    <Flex id="flex" minH={"100vh"} align={"center"} justify={"center"}>
      <SignUp />
    </Flex>
  );
};

export default SignUpPage;
