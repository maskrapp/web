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

import { useAxios } from "../../../hooks/useAxios";
import { useModal } from "../../../hooks/useModal";
import { APIResponse, Email } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";

interface Focusable {
  focus: () => void;
}

interface EmailModalProps {
  finalRef?: React.RefObject<Focusable>;
  closeFn: () => void;
}

export const CreateEmailModal = ({ closeFn }: EmailModalProps) => {
  interface FormValues {
    email: string;
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const toast = useToast();
  const axios = useAxios();

  const { verifyEmailModal } = useModal();

  const makeEmailRequest = async (email: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/add-email`, {
        email,
      });
      return { ...response, email: email };
    } catch (e) {
      throw e;
    }
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation((email: string) => makeEmailRequest(email), {
    onSuccess: (data) => {
      toast({
        title: "Email added",
        description: "Check your mailbox for a verification code",
        status: "success",
        position: "top",
      });
      const emails: Email[] = queryClient.getQueryData(["emails"]) ?? [];
      queryClient.setQueryData(
        ["emails"],
        [
          ...emails,
          { email: data.email, is_primary: false, is_verified: false },
        ]
      );
      verifyEmailModal.openWithProps(data.email, true);
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
  });

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
              isLoading={isSubmitting}
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
