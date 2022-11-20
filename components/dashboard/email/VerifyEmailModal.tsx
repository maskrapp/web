import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosInstance } from "axios";
import { useEffect, useRef, useState } from "react";
import { useAxios } from "../../../hooks/useAxios";
import { APIResponse, Email } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";
import { verificationCodeSchema } from "../../../utils/zod";

const requestNewCode = (axios: AxiosInstance, email: string) => {
  return axios.post(`${BACKEND_URL}/api/user/request-code`, {
    email,
  });
};

const verifyCode = (axios: AxiosInstance, email: string, code: string) => {
  return axios.post(`${BACKEND_URL}/api/user/verify-email`, {
    email,
    code,
  });
};

interface Props {
  closeFn: () => void;
  email: string;
  codeSent: boolean;
}

export const VerifyEmailModal = ({ closeFn, email, codeSent }: Props) => {
  const axios = useAxios();
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const requestCodeMutation = useMutation(() => requestNewCode(axios, email), {
    onError: (data: AxiosError<APIResponse, any>) => {
      toast({
        title: "Error",
        description: data.response?.data?.message,
        status: "error",
        position: "top",
        isClosable: true,
      });
    },
  });
  const queryClient = useQueryClient();
  const verifyCodeMutation = useMutation(
    (code: string) => verifyCode(axios, email, code),
    {
      retry: false,
      onError: (data: AxiosError<APIResponse, any>) => {
        toast({
          title: "Error",
          description: data.response?.data?.message,
          status: "error",
          position: "top",
          isClosable: true,
        });
        setCode("");
        firstInputRef.current?.focus();
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "",
          status: "success",
          position: "top",
          isClosable: true,
        });
        const emails = queryClient.getQueryData<Email[]>(["emails"]) ?? [];
        let idx = 0;
        for (const entry of emails) {
          if (entry.email === email) {
            emails[idx] = { ...entry, is_verified: true };
            break;
          }
          idx++;
        }
        queryClient.setQueryData(["emails"], emails);
        closeFn();
      },
    }
  );

  useEffect(() => {
    if (!codeSent) {
      requestCodeMutation.mutate();
    }
  }, [codeSent, requestCodeMutation]);

  const [code, setCode] = useState<string>();

  return (
    <Modal isOpen={true} onClose={closeFn}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verify Email</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Alert status="success" rounded="base" mb="3">
            <AlertIcon />
            <AlertDescription>A code has been sent to {email}</AlertDescription>
          </Alert>
          <Flex pt="5" justifyContent="center">
            <HStack>
              <PinInput
                value={code}
                otp
                type="number"
                size="lg"
                autoFocus
                onChange={(value) => {
                  setCode(value);
                }}
                onComplete={(value: string) => {
                  const { success } = verificationCodeSchema.safeParse(value);
                  if (success) {
                    verifyCodeMutation.mutate(value);
                  } else {
                    firstInputRef.current?.focus();
                  }
                }}
              >
                <PinInputField ref={firstInputRef} />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Flex>
        </ModalBody>
        <ModalFooter display="block">
          <Flex direction="row" justifyContent="space-between">
            <Button
              variant="link"
              onClick={() => {
                requestCodeMutation.mutate();
              }}
            >
              Re-send code
            </Button>
            <Button onClick={closeFn}>Cancel</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
