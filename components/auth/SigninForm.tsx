import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { GoogleSignin } from "./buttons/GoogleSignin";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import { APIResponse, TokenPair } from "../../types";
import { AuthCard } from "../shared/AuthCard";
import { signInWithEmail } from "../../api/auth";

interface SignInArguments {
  email: string;
  password: string;
}

export const SigninForm = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>();
  const { actions } = useUser();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { mutate } = useMutation(
    ({
      email,
      password,
      captcha_token,
    }: SignInArguments & { captcha_token: string }) =>
      signInWithEmail(axios, { email, password, captcha_token }),
    {
      onSuccess: (data: AxiosResponse<TokenPair, any>) => {
        localStorage.setItem("access_token", data.data.access_token.token);
        localStorage.setItem("refresh_token", data.data.refresh_token.token);
        actions.signIn(data.data);
        router.push("/");
      },
      onError: (data: AxiosError) => {
        const response = data.response?.data as APIResponse;
        if (data.response?.status === 400) {
          setApiError(response.message ?? "Something went wrong");
        }
      },
    },
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

  return (
    <AuthCard>
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
          <FormControl>
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
                onClick={() => router.push("/forgot-password")}
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
    </AuthCard>
  );
};
