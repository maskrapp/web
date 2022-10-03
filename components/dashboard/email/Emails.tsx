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
  useBreakpoint,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosInstance } from "axios";
import { useAxios } from "../../../hooks/useAxios";
import { APIResponse, Email } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";
import { ConfirmationModal } from "../ConfirmationModal";
import { EmailModal } from "./EmailModal";

export const Emails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const axios = useAxios();

  const fetchEmails = async () => {
    const response = await axios.post<Email[]>("/api/user/emails");
    return response.data ?? [];
  };
  const query = useQuery<Email[], Error>(["emails"], fetchEmails, {
    cacheTime: 3600,
    refetchOnMount: false,
  });
  const emails = query.data;
  console.log(useBreakpoint());

  return (
    <TableContainer
      boxSize={{
        base: "100%", // 0-48em
        sm: "100%",
        md: "100%", // 48em-80em,
        lg: "70%",
        xl: "45%", // 80em+ //
      }}
    >
      {isOpen && <EmailModal isOpen={isOpen} onClose={onClose} />}

      <Button onClick={onOpen}>Add Email</Button>
      <Table variant="unstyled">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th></Th>
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

const requestNewLink = (axios: AxiosInstance, email: string) => {
  const jsonStr = localStorage.getItem("supabase.auth.token");
  const data = JSON.parse(jsonStr ?? "{}");
  return axios.post(`${BACKEND_URL}/api/user/send-link`, {
    email,
  });
};
const deleteEmail = (axios: AxiosInstance, email: string) => {
  const jsonStr = localStorage.getItem("supabase.auth.token");
  const data = JSON.parse(jsonStr ?? "{}");
  return axios.delete(`${BACKEND_URL}/api/user/delete-email`, {
    data: { email },
  });
};
