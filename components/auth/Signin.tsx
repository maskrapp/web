import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useState } from "react";
import { GoogleSignin } from "./buttons/GoogleSignin";
import { ForgotPasswordForm } from "./ForgotPassword";

export const Signin = () => {
  const [forgotPassword, setForgotPassword] = useState(false);
  if (!forgotPassword) {
    return (
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Don&apos;t have an account?{" "}
            <Link color={"blue.400"}>Create one here</Link> ️
          </Text>
        </Stack>
        <Box rounded={"lg"} bg="blackAlpha.300" boxShadow={"lg"} p={8}>
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

            <GoogleSignin />
          </Stack>
        </Box>
      </Stack>
    );
  }
  return (
    <ForgotPasswordForm
      goBackfn={() => setForgotPassword(false)}
    ></ForgotPasswordForm>
  );
};
