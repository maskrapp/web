import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  ListItem,
  Text,
  UnorderedList,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import { APIResponse, TokenPair } from "@/types";
import {
  createAccount,
  createAccountCode,
  resendCode,
  verifyAccountCode,
} from "../../api/auth";
import { AuthCard } from "@/components/shared/AuthCard";
import { PASSWORD_REGEXP } from "@/utils/constants";

export const SignUpForm = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const getStepComponent = () => {
    switch (step) {
      case 0:
        return (
          <EmailForm
            successFn={(email: string) => {
              setEmail(email);
              setStep(1);
            }}
          />
        );
      case 1:
        return (
          <VerifyCodeForm
            email={email}
            successFn={(code: string) => {
              setCode(code);
              setStep(2);
            }}
          />
        );
      case 2:
        return <CreateAccountForm email={email} code={code} />;
    }
  };

  return (
    <AuthCard>
      {getStepComponent()}
    </AuthCard>
  );
};

interface EmailFormProps {
  successFn: (email: string) => void;
}

const EmailForm = ({ successFn }: EmailFormProps) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<{ email: string }>();
  const { mutate } = useMutation(
    ({ email, captcha_token }: { email: string; captcha_token: string }) =>
      createAccountCode(axios, { email, captcha_token }),
    {
      onSuccess: (data) => {
        successFn(data.email);
      },
      onError: (data: AxiosError) => {
        const response = data.response?.data as APIResponse;
        if (data.response?.status === 400) {
          setError("email", {
            type: "value",
            message: response.message,
          });
        }
      },
    },
  );

  const onSubmit: SubmitHandler<{ email: string }> = async ({ email }) => {
    if (!executeRecaptcha) {
      console.error("recaptcha is not available!");
      return;
    }
    const captcha_token = await executeRecaptcha("create_account_code");
    mutate({ email, captcha_token });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="8">
          <FormControl id="email" isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <VStack spacing="2">
            <Button
              type="submit"
              loadingText="Submitting"
              w="100%"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Get started
            </Button>
            <Text color="gray.400">
              By proceeding, you agree to the Terms of Service and Privacy
              Notice.
            </Text>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
};

interface VerifyCodeProps {
  email: string;
  successFn: (code: string) => void;
}

const VerifyCodeForm = ({ email, successFn }: VerifyCodeProps) => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<{ code: string }>();

  const toast = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const verifyCodeMutation = useMutation(
    ({ code, captcha_token }: { code: string; captcha_token: string }) =>
      verifyAccountCode(axios, { email, code, captcha_token }),
    {
      onSuccess: (data) => {
        successFn(data.code);
      },
      onError: (data: AxiosError) => {
        const response = data.response?.data as APIResponse;
        if (data.response?.status === 400 && response?.message) {
          setError("code", {
            message: response.message,
            type: "value",
          });
        }
      },
    },
  );

  const resendCodeMutation = useMutation(
    (captcha_token: string) => resendCode(axios, { email, captcha_token }),
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Check your mailbox for a new code",
          status: "success",
          position: "top",
        });
      },
    },
  );

  const onSubmit: SubmitHandler<{ code: string }> = async ({ code }) => {
    if (!executeRecaptcha) {
      console.error("recaptcha is not available!");
      return;
    }
    const captcha_token = await executeRecaptcha("verify_account_code");
    verifyCodeMutation.mutate({ code, captcha_token });
  };

  return (
    <Box>
      <HStack mb="3">
        <Alert status="success" rounded="base" mb="3">
          <AlertIcon />
          <AlertDescription>A code has been sent to {email}</AlertDescription>
        </Alert>
      </HStack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="email" isInvalid={!!errors.code}>
          <FormLabel>Verification Code</FormLabel>
          <Input
            type="text"
            {...register("code", {
              required: true,
              pattern: /^[0-9]{5}$/i,
            })}
          />
          <FormErrorMessage>
            {errors.code && errors.code.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt="5"
          type="submit"
          w="full"
          loadingText="Submitting"
          size="lg"
          bg={"blue.400"}
          color={"white"}
          _hover={{
            bg: "blue.500",
          }}
        >
          Confirm
        </Button>
        <Button
          w="100%"
          mt="2.5"
          onClick={async () => {
            if (!executeRecaptcha) {
              console.error("recaptcha is not available!");
              return;
            }
            const token = await executeRecaptcha("resend_account_code");
            resendCodeMutation.mutate(token);
          }}
        >
          Re-send code
        </Button>
      </form>
    </Box>
  );
};

interface CreateAccountFormValues {
  password: string;
  confirmPassword: string;
}

interface CreateAccountFormProps {
  email: string;
  code: string;
}

const CreateAccountForm = ({ email, code }: CreateAccountFormProps) => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormValues>();

  const router = useRouter();
  const { actions } = useUser();
  const { mutate } = useMutation(
    ({
      email,
      password,
      code,
      captcha_token,
    }: {
      email: string;
      password: string;
      code: string;
      captcha_token: string;
    }) => createAccount(axios, { email, password, code, captcha_token }),
    {
      onSuccess: (data: AxiosResponse<TokenPair, any>) => {
        const tokens = data.data;
        localStorage.setItem("access_token", tokens.access_token.token);
        localStorage.setItem("refresh_token", tokens.refresh_token.token);
        actions.signIn(data.data);
        router.push("/");
      },
      onError: (data) => {
        console.log("ERROR", data);
      },
    },
  );
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit: SubmitHandler<CreateAccountFormValues> = async ({
    password,
  }) => {
    if (!executeRecaptcha) {
      console.error("recaptcha is not available!");
      return;
    }
    const captcha_token = await executeRecaptcha("create_account");
    mutate({ email, password, code, captcha_token });
  };
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={2}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input value={email} isReadOnly />
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", {
                pattern: {
                  value: PASSWORD_REGEXP,
                  message:
                    "Password should contain at least one uppercase character, a numeric character, a special character and must be between 8 and 32 characters",
                },
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              {...register("confirmPassword", {
                required: true,
                validate: (value: string) => {
                  if (watch("password") != value) {
                    return "Passwords do not match";
                  }
                },
              })}
            />
            <FormErrorMessage>
              {errors.confirmPassword && errors.confirmPassword.message}
            </FormErrorMessage>
          </FormControl>
        </VStack>
        <Box mt="3" textColor="gray.100">
          <Text>Your password must:</Text>
          <UnorderedList mt="0.5">
            <ListItem>be between 8 and 32 characters</ListItem>
            <ListItem>have at least 1 special character</ListItem>
            <ListItem>have at least 1 number</ListItem>
            <ListItem>have at least 1 uppercase character</ListItem>
          </UnorderedList>
        </Box>

        <Button
          w="100%"
          mt="5"
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          bg={"blue.400"}
          color={"white"}
          _hover={{
            bg: "blue.500",
          }}
        >
          Create account
        </Button>
      </form>
    </Box>
  );
};
