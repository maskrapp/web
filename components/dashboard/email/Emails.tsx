import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { APIResponse, Email } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";
import { ConfirmationModal } from "../ConfirmationModal";
import { EmailModal } from "./EmailModal";

export const Emails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchEmails = async () => {
    return [];
  };
  const query = useQuery<Email[], Error>(["emails"], fetchEmails, {
    cacheTime: 3600,
    refetchOnMount: false,
  });

  const emails = query.data;
  return (
    <TableContainer boxSize={"50%"}>
      {isOpen && <EmailModal isOpen={isOpen} onClose={onClose} />}

      <Button onClick={onOpen}>Add Email</Button>
      <Table variant="unstyled">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {emails?.map((email) => (
            <EmailEntry
              key={email.email}
              email={email.email}
              is_verified={email.is_verified}
              is_primary={email.is_primary}
            />
          ))}
        </Tbody>
        <Tfoot></Tfoot>
      </Table>
    </TableContainer>
  );
};

interface EntryProps {
  email: string;
  is_verified: boolean;
  is_primary: boolean;
}
const EmailEntry = ({ email, is_verified, is_primary }: EntryProps) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const requestLinkMutation = useMutation(
    (email: string) => requestNewLink(email),
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
    (email: string) => deleteEmail(email),
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
      <Tr>
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
      </Tr>
    </>
  );
};

const requestNewLink = (email: string) => {
  const jsonStr = localStorage.getItem("supabase.auth.token");
  const data = JSON.parse(jsonStr ?? "{}");
  return axios.post(
    `${BACKEND_URL}/api/user/send-link`,
    {
      email,
    },
    {
      headers: {
        Authorization: data.currentSession.access_token,
      },
    }
  );
};
const deleteEmail = (email: string) => {
  const jsonStr = localStorage.getItem("supabase.auth.token");
  const data = JSON.parse(jsonStr ?? "{}");
  return axios.delete(`${BACKEND_URL}/api/user/delete-email`, {
    data: { email },
    headers: {
      Authorization: data.currentSession.access_token,
    },
  });
};
