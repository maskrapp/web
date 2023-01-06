import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  Td,
  Text,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { deleteEmail, requestNewCode } from "../../../api/email";

import { useAxios } from "../../../hooks/useAxios";
import { useModal } from "../../../hooks/useModal";
import { APIResponse, Email } from "../../../types";
import { ConfirmationModal } from "../ConfirmationModal";

const MotionTr = motion(Tr);

interface Props {
  email: string;
  is_verified: boolean;
  is_primary: boolean;
}

export const EmailEntry = ({ email, is_verified, is_primary }: Props) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const axios = useAxios();
  const deleteEmailMutation = useMutation(
    (email: string) => deleteEmail(axios, email),
    {
      onSuccess: (_) => {
        const data: Email[] = queryClient.getQueryData(["emails"]) ?? [];
        queryClient.setQueryData(
          ["emails"],
          data.filter((value) => value.email !== email),
        );
        toast({
          title: "Deleted Email",
          status: "success",
          position: "top",
          isClosable: true,
        });
      },
      onError: (data: AxiosError<APIResponse>) => {
        toast({
          title: "Error",
          description: data.response?.data.message,
          status: "error",
          position: "top",
          isClosable: true,
        });
      },
    },
  );

  const confirmationModalDisclosure = useDisclosure();
  const modal = useModal();

  const { mutate, isLoading } = useMutation(
    () => requestNewCode(axios, email),
    {
      onSuccess: () => modal.verifyEmailModal.openWithProps(email),
      onError: (data: AxiosError<APIResponse, any>) => {
        toast({
          title: "Error",
          description: data.response?.data?.message,
          status: "error",
          position: "top",
          isClosable: true,
        });
      },
    },
  );

  return (
    <>
      {confirmationModalDisclosure.isOpen && (
        <ConfirmationModal
          text="This action cannot be reversed, are you sure you want to delete this email?"
          onClose={confirmationModalDisclosure.onClose}
          submitButtonText="Delete Email"
          submitAction={() => deleteEmailMutation.mutate(email)}
        />
      )}
      <MotionTr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Td>{email}</Td>
        <Td>
          {is_verified
            ? <Text color="green.300">Verified</Text>
            : <Text color="red.300">Unverified</Text>}
        </Td>
        <Td>
          <HStack>
            {!is_verified && (
              <IconButton
                aria-label="Verify Email"
                colorScheme="green"
                icon={<CheckIcon />}
                isLoading={isLoading}
                onClick={() => mutate()}
              />
            )}
            <IconButton
              colorScheme="red"
              aria-label="Delete Email"
              icon={<DeleteIcon />}
              disabled={is_primary}
              onClick={confirmationModalDisclosure.onOpen}
            />
          </HStack>
        </Td>
      </MotionTr>
    </>
  );
};
