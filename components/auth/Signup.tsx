import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { GoVerified } from "react-icons/go";
import { useUser } from "../../hooks/useUser";
import { APIResponse, TokenPair } from "../../types";
import { BACKEND_URL } from "../../utils/constants";
import { pairSchema } from "../../utils/zod";

export const SignUp = () => {
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
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"4xl"}>Create an account</Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          Already have an account?{" "}
          <Link href="/signin">
            <ChakraLink color={"blue.400"}>Sign in here</ChakraLink>
          </Link>
        </Text>
      </Stack>
      <Box
        rounded={"lg"}
        bg="blackAlpha.300"
        w={{ base: "100%", sm: "100%", md: "26em" }}
        boxShadow={"lg"}
        p={8}
      >
        {getStepComponent()}
      </Box>
    </Stack>
  );
};

const makeCodeRequest = async (email: string) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/create-account-code`,
      {
        email,
      }
    );
    return { ...response, email: email };
  } catch (e) {
    throw e;
  }
};

interface EmailFormProps {
  successFn: (email: string) => void;
}

const EmailForm = ({ successFn }: EmailFormProps) => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<{ email: string }>();
  const { mutate } = useMutation((email: string) => makeCodeRequest(email), {
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
  });

  const onSubmit: SubmitHandler<{ email: string }> = ({ email }) => {
    mutate(email);
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
              size="lg"
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

const makeVerifyCodeRequest = async (email: string, code: string) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/verify-account-code`,
      {
        email,
        code,
      }
    );
    return { ...response, code };
  } catch (e) {
    throw e;
  }
};

const makeResendCodeRequest = (email: string) => {
  return axios.post(`${BACKEND_URL}/auth/resend-account-code`, {
    email,
  });
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
    formState: { errors, isSubmitting },
  } = useForm<{ code: string }>();

  const toast = useToast();

  const verifyCodeMutation = useMutation(
    (code: string) => makeVerifyCodeRequest(email, code),
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
    }
  );

  const resendCodeMutation = useMutation(() => makeResendCodeRequest(email), {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Check your mailbox for the new code",
        status: "success",
        position: "top",
      });
    },
  });

  const onSubmit: SubmitHandler<{ code: string }> = ({ code }) => {
    verifyCodeMutation.mutate(code);
  };

  return (
    <Box>
      <HStack mb="3">
        <Icon as={GoVerified} />
        <Text>A code has been sent to your email.</Text>
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
        <Button w="100%" mt="2.5" onClick={() => resendCodeMutation.mutate()}>
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

const makeCreateAccountRequest = (
  email: string,
  password: string,
  code: string
) => {
  return axios.post(`${BACKEND_URL}/auth/create-account`, {
    email,
    password,
    code,
  });
};

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
    }: {
      email: string;
      password: string;
      code: string;
    }) => makeCreateAccountRequest(email, password, code),
    {
      onSuccess: (data: AxiosResponse<TokenPair, any>) => {
        const { success } = pairSchema.safeParse(data.data);
        if (success) {
          localStorage.setItem("tokens", JSON.stringify(data.data));
          actions.signIn(data.data);
          router.push("/");
        }
      },
      onError: (data) => {
        console.log("ERROR", data);
      },
    }
  );

  const onSubmit: SubmitHandler<CreateAccountFormValues> = ({ password }) => {
    mutate({ email: email, password: password, code: code });
  };
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={2}>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", {
                required: true,
                minLength: {
                  value: 4,
                  message: "Password length should be at least 4 characters",
                },
                maxLength: {
                  value: 16,
                  message: "Password cannot exceed more than 12 characters",
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
