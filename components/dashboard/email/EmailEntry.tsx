import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosInstance } from "axios";
import { motion } from "framer-motion";
import { useAxios } from "../../../hooks/useAxios";
import { APIResponse, Email } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";
import { ConfirmationModal } from "../ConfirmationModal";

const requestNewLink = (axios: AxiosInstance, email: string) => {
  return axios.post(`${BACKEND_URL}/api/user/send-link`, {
    email,
  });
};
const deleteEmail = (axios: AxiosInstance, email: string) => {
  return axios.delete(`${BACKEND_URL}/api/user/delete-email`, {
    data: { email },
  });
};

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
  const requestLinkMutation = useMutation(
    (email: string) => requestNewLink(axios, email),
    {
      onSuccess: (data) => {
        toast({
          title: "Email sent!",
          description: "Check your mailbox for a verification link",
          status: "success",
          position: "top",
          isClosable: true,
        });
      },
      onError: (data: AxiosError<APIResponse, any>) => {
        toast({
          title: "Error",
          description: data.response?.data?.message,
          status: "error",
          position: "top",
          isClosable: true,
        });
      },
    }
  );
  const deleteEmailMutation = useMutation(
    (email: string) => deleteEmail(axios, email),
    {
      onSuccess: (_) => {
        const data: Email[] = queryClient.getQueryData(["emails"]) ?? [];
        queryClient.setQueryData(
          ["emails"],
          data.filter((value) => value.email !== email)
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
    }
  );

  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      {isOpen && (
        <ConfirmationModal
          text="placeholder"
          onClose={onClose}
          submitButtonText="Delete Email"
          submitAction={() => deleteEmailMutation.mutate(email)}
        />
      )}
      <MotionTr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Td>{email}</Td>
        <Td>{is_verified ? "Verified" : "Unverified"}</Td>
        <Td>
          <Menu>
            <MenuButton as={Button} disabled={is_primary}>
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              {!is_verified && (
                <MenuItem onClick={() => requestLinkMutation.mutate(email)}>
                  Verify
                </MenuItem>
              )}
              <MenuItem as="button" color="red.400" onClick={() => onOpen()}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Td>
      </MotionTr>
    </>
  );
};
