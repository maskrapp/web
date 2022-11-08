import {
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { useAxios } from "../../../hooks/useAxios";
import { Email } from "../../../types";
import { Card } from "../../shared/Card";
import { EmailEntry } from "./EmailEntry";

interface Props {
  openModalFn: () => void;
}

export const Emails = ({ openModalFn }: Props) => {
  const axios = useAxios();

  const fetchEmails = async () => {
    const response = await axios.post<Email[]>("/api/user/emails");
    return response.data ?? [];
  };
  const query = useQuery<Email[], Error>(["emails"], fetchEmails, {
    cacheTime: 3600,
    refetchOnMount: false,
  });

  const emails = query.data ?? [];

  return (
    <Card>
      <Flex direction="row" justifyContent="space-between" mx="6">
        <Text>Connected emails</Text>
        <Button variant={"outline"} onClick={openModalFn}>
          Add email
        </Button>
      </Flex>
      <TableContainer overflow="auto">
        <Table variant="unstyled">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {emails.map((email) => (
              <EmailEntry
                key={email.email}
                email={email.email}
                is_primary={email.is_primary}
                is_verified={email.is_verified}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Card>
  );
};
