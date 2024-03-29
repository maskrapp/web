import { addEmail, requestNewCode } from "@/api/email";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

import { useAxios } from "@/hooks/useAxios";
import { APIResponse, Email } from "@/types";

interface EmailModalProps {
  closeFn: () => void;
  onSuccess: (email: string) => void;
}

interface FormValues {
  email: string;
}

export const CreateEmailModal = ({ closeFn, onSuccess }: EmailModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>();

  const toast = useToast();
  const axios = useAxios();

  const queryClient = useQueryClient();

  const requestCodeMutation = useMutation(
    (email: string) => requestNewCode(axios, email),
    {
      onSuccess: (data: any) => {
        onSuccess(data.email as string);
      },
    }
  );

  const { mutate, isLoading } = useMutation(
    (email: string) => addEmail(axios, email),
    {
      onSuccess: (data) => {
        const emails: Email[] = queryClient.getQueryData(["emails"]) ?? [];
        queryClient.setQueryData(
          ["emails"],
          [
            { email: data.email, is_primary: false, is_verified: false },
            ...emails,
          ]
        );
        requestCodeMutation.mutate(data.email);
      },
      onError: (data: AxiosError<APIResponse, any>) => {
        toast({
          title: "Error",
          description: data.response?.data.message,
          status: "error",
          position: "top",
          isClosable: true,
        });
      },
    }
  );

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!values.email) return;
    mutate(values.email);
    closeFn();
  };

  return (
    // isOpen state is managed elsewhere
    <Modal isOpen={true} onClose={closeFn}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new Email</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="john@example.com"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "",
                  },
                })}
                name="email"
                autoFocus
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              isLoading={isLoading}
            >
              Add
            </Button>
            <Button onClick={closeFn}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
