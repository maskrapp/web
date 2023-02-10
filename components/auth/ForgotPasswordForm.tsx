import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Link as ChakraLink,
  PinInput,
  PinInputField,
  Stack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { changePassword, resetPassword, verifyPasswordCode } from "@/api/auth";
import { APIResponse } from "@/types";
import { PASSWORD_REGEXP } from "@/utils/constants";
import { AuthCard } from "@/components/shared/AuthCard";

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const getStepComponent = () => {
    switch (step) {
      case 0:
        return (
          <StepOne
            successFn={(_email: string) => {
              setEmail(_email);
              setStep(1);
            }}
          />
        );
      case 1:
        return (
          <StepTwo
            email={email}
            successFn={(_token: string) => {
              setToken(_token);
              setStep(2);
            }}
          />
        );
      case 2:
        return <StepThree token={token} />;
    }
  };
  return (
    <AuthCard>
      {getStepComponent()}
    </AuthCard>
  );
};

const StepOne = ({ successFn }: { successFn: (email: string) => void }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<{ email: string }>();

  const { mutate, isLoading } = useMutation(
    ({ email, captcha_token }: { email: string; captcha_token: string }) =>
      resetPassword(axios, { email, captcha_token }),
    {
      onSuccess: (data) => {
        successFn(data.email);
      },
      onError: (error: AxiosError<APIResponse>) => {
        const data = error.response?.data;
        setError("email", {
          type: "value",
          message: data?.message ?? "Something went wrong. Try again.",
        });
      },
    },
  );
  const onSubmit: SubmitHandler<{ email: string }> = async ({ email }) => {
    if (!executeRecaptcha) {
      console.error("recaptcha is not available!");
      return;
    }
    const captcha_token = await executeRecaptcha("reset_password");
    mutate({ email, captcha_token });
  };
  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.email} mb="2">
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            {...register("email", {
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            })}
          />
          <FormErrorMessage>
            {errors.email?.message}
          </FormErrorMessage>
        </FormControl>
        <Link href="signin">
          <ChakraLink color="blue.400" fontWeight="semibold">
            I remember my password
          </ChakraLink>
        </Link>
        <Button
          my="5"
          type="submit"
          isLoading={isLoading}
          w="full"
          bg="blue.400"
          color={"white"}
          _hover={{
            bg: "blue.500",
          }}
        >
          Request Reset Code
        </Button>
      </form>
    </Stack>
  );
};

const StepTwo = (
  { email, successFn }: {
    email: string;
    successFn: (token: string) => void;
  },
) => {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<{ code: string }>();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { mutate, isLoading } = useMutation(
    (
      { email, captcha_token, code }: {
        email: string;
        code: string;
        captcha_token: string;
      },
    ) => verifyPasswordCode(axios, { email, code, captcha_token }),
    {
      onSuccess: (data: AxiosResponse<{ token: string }>) => {
        successFn(data.data.token);
      },
      onError: (data: AxiosError<APIResponse>) => {
        const response = data.response?.data;
        setError("code", {
          type: "value",
          message: response?.message ?? "Something went wrong. Try again.",
        });
      },
    },
  );

  const toast = useToast();
  const {
    mutate: codeMutate,
    isLoading: isCodeLoading,
  } = useMutation(
    ({ email, captcha_token }: { email: string; captcha_token: string }) =>
      resetPassword(axios, { email, captcha_token }),
    {
      onSuccess: (_) => {},
      onError: (data: AxiosError) => {
        const response = data.response?.data as APIResponse;
        toast({
          status: "error",
          position: "top",
          description: response.message ?? "Something went wrong. Try again.",
        });
      },
    },
  );

  const requestNewCode = async () => {
    if (!executeRecaptcha) {
      console.error("recaptcha is not available!");
      return;
    }
    const captcha_token = await executeRecaptcha("reset_password");
    codeMutate({ email, captcha_token });
  };

  const onSubmit: SubmitHandler<{ code: string }> = async ({ code }) => {
    if (!executeRecaptcha) {
      console.error("recaptcha is not available!");
      return;
    }
    const captcha_token = await executeRecaptcha("verify_password");
    mutate({ email, captcha_token, code });
  };

  return (
    <Box>
      <Alert status="success" rounded="base" mb="3">
        <AlertIcon />
        <AlertDescription>A code has been sent to {email}</AlertDescription>
      </Alert>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          gap="5"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <FormControl isInvalid={!!errors.code}>
            <HStack justifyContent="center">
              <Controller
                name="code"
                control={control}
                rules={{
                  required: true,
                  minLength: 6,
                  maxLength: 6,
                }}
                render={({
                  field: { onChange, value },
                }) => (
                  <PinInput
                    size="lg"
                    onChange={onChange}
                    value={value}
                    isDisabled={isLoading}
                    onComplete={() => submitButtonRef.current?.click()}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                )}
              />
            </HStack>
            <FormErrorMessage>
              {errors.code?.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            variant="link"
            color="blue.300"
            alignSelf="start"
            isLoading={isCodeLoading}
            onClick={() => requestNewCode()}
          >
            Re-send code
          </Button>
          <Button
            ref={submitButtonRef}
            bgColor="blue.400"
            type="submit"
            _hover={{
              bg: "blue.500",
            }}
            w="full"
            isLoading={isLoading}
          >
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export const StepThree = ({ token }: { token: string }) => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<{ token: string; password: string; confirmPassword: string }>();

  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const { mutate, isSuccess, isLoading } = useMutation(
    ({
      password,
      token,
      captcha_token,
    }: {
      password: string;
      token: string;
      captcha_token: string;
    }) => changePassword(axios, { password, token, captcha_token }),
    {
      onSuccess: (_) => {
        // give the user time to read the message.
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      },
      onError: (data: AxiosError<APIResponse>) => {
        const message = data.response?.data.message;
        setApiError(
          message ?? "Something went wrong. Try again.",
        );
        if (message?.includes("session has expired")) {
          // give the user time to read the message.
          setTimeout(() => {
            router.push(window.location.pathname);
          }, 1000);
        }
      },
    },
  );
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit: SubmitHandler<{ token: string; password: string }> = async ({
    password,
  }) => {
    if (!executeRecaptcha) {
      console.error("recaptcha is not available!");
      return;
    }
    const captcha_token = await executeRecaptcha("confirm_password");
    mutate({ password, token, captcha_token });
  };
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={2}>
          {isSuccess &&
            (
              <Alert status="success" rounded="base" mb="3">
                <AlertIcon />
                <AlertDescription>
                  You may now sign in with your new password
                </AlertDescription>
              </Alert>
            )}
          {!!apiError &&
            (
              <Alert status="error" rounded="base" mb="3">
                <AlertIcon />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", {
                required: true,
                disabled: isSuccess,
                pattern: {
                  value: PASSWORD_REGEXP,
                  message:
                    "Password should contain at least one uppercase character, a numeric character, a special character and must be between 8 and 32 characters",
                },
                onChange: () => setApiError(""),
              })}
            />
            <FormErrorMessage>
              {errors.password?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              {...register("confirmPassword", {
                required: true,
                disabled: isSuccess,
                validate: (value: string) => {
                  if (watch("password") != value) {
                    return "Passwords do not match";
                  }
                },
                onChange: () => setApiError(""),
              })}
            />
            <FormErrorMessage>
              {errors.confirmPassword?.message}
            </FormErrorMessage>
          </FormControl>
        </VStack>
        <Button
          w="100%"
          mt="5"
          type="submit"
          size="lg"
          isLoading={isLoading}
          isDisabled={isSuccess}
          bg={"blue.400"}
          color={"white"}
          _hover={{
            bg: "blue.500",
          }}
        >
          Change Password
        </Button>
      </form>
    </Box>
  );
};
