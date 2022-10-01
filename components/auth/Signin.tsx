import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModePreference,
} from "@chakra-ui/react";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleSignin } from "./buttons/GoogleSignin";
import { ForgotPasswordForm } from "./ForgotPassword";

export const Signin = () => {
  const [forgotPassword, setForgotPassword] = useState(false);
  const color = useColorModePreference();
  if (!forgotPassword) {
    return (
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={color === "light" ? "gray.50" : "gray.800"}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              Don&apos;t have an account?{" "}
              <Link color={"blue.400"}>Create one here</Link> ️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={color === "light" ? "white" : "gray.700"}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link
                    onClick={() => setForgotPassword(true)}
                    color={"blue.400"}
                  >
                    Forgot password?
                  </Link>
                </Stack>

                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
              <Divider />
              <Button
                w={"full"}
                maxW={"md"}
                variant={"outline"}
                leftIcon={<FcGoogle />}
              >
                <Center>
                  <Text>Sign in with Google</Text>
                </Center>
              </Button>
              <GoogleSignin />
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }
  return (
    <ForgotPasswordForm
      goBackfn={() => setForgotPassword(false)}
    ></ForgotPasswordForm>
  );
};
