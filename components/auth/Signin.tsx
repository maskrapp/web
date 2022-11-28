import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { GoogleSignin } from "./buttons/GoogleSignin";
import { ForgotPasswordForm } from "./ForgotPassword";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import router from "next/router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import { APIResponse, TokenPair } from "../../types";
import { BACKEND_URL } from "../../utils/constants";
import { pairSchema } from "../../utils/zod";
const makeLoginRequest = (
  email: string,
  password: string,
  captcha_token: string
) => {
  return axios.post(`${BACKEND_URL}/auth/email-login`, {
    email,
    password,
    captcha_token,
  });
};

interface SignInArguments {
  email: string;
  password: string;
}

export const Signin = () => {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [apiError, setApiError] = useState<string>();
  const { actions } = useUser();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { mutate } = useMutation(
    ({
      email,
      password,
      captcha_token,
    }: SignInArguments & { captcha_token: string }) =>
      makeLoginRequest(email, password, captcha_token),
    {
      onSuccess: (data: AxiosResponse<TokenPair, any>) => {
        const { success } = pairSchema.safeParse(data.data);
        if (success) {
          localStorage.setItem("access_token", data.data.access_token.token);
          localStorage.setItem("refresh_token", data.data.refresh_token.token);
          actions.signIn(data.data);
          router.push("/");
        }
      },
      onError: (data: AxiosError) => {
        const response = data.response?.data as APIResponse;
        if (data.response?.status === 400) {
          setApiError(response.message ?? "Something went wrong");
        }
      },
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInArguments>();

  const onSubmit: SubmitHandler<SignInArguments> = async (args) => {
    if (!executeRecaptcha) {
      console.error("recaptcha is not available!");
      return;
    }
    const captcha_token = await executeRecaptcha("email_login");
    mutate({ ...args, captcha_token });
  };

  if (!forgotPassword) {
    return (
      <Stack spacing={8} maxW={"lg"} py={12} px={6}>
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
        <Box
          rounded={"lg"}
          bg="blackAlpha.300"
          w={{ base: "100%", sm: "100%", md: "26em" }}
          minH="25em"
          boxShadow={"lg"}
          p={8}
        >
          {!!apiError && (
            <Alert status="error" rounded="base" mb="3">
              <AlertIcon />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    onChange: () => {
                      setApiError("");
                    },
                  })}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", {
                    required: true,
                    minLength: 4,
                    maxLength: 16,
                    onChange: () => {
                      setApiError("");
                    },
                  })}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Button
                    variant="link"
                    onClick={() => setForgotPassword(true)}
                    color={"blue.400"}
                  >
                    Forgot password?
                  </Button>
                </Stack>

                <Button
                  type="submit"
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
          </form>
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
