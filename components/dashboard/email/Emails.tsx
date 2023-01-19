import {
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { fetchEmails } from "../../../api/email";

import { useAxios } from "../../../hooks/useAxios";
import { Email } from "../../../types";
import { Card } from "../../shared/Card";
import { EmailEntry } from "./EmailEntry";

interface Props {
  openModalFn: () => void;
}

export const Emails = ({ openModalFn }: Props) => {
  const axios = useAxios();

  const query = useQuery<Email[]>(["emails"], () => fetchEmails(axios), {
    cacheTime: 3600,
    refetchOnMount: false,
  });

  return (
    <Card>
      <Flex direction="row" justifyContent="space-between" mx="6">
        <Flex gap="2.5">
          <Text>Connected Emails</Text>
          <Spinner hidden={!query.isLoading} />
        </Flex>
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
            <AnimatePresence>
              {query.data?.map((email) => (
                <EmailEntry
                  key={email.email}
                  email={email.email}
                  is_primary={email.is_primary}
                  is_verified={email.is_verified}
                />
              ))}
            </AnimatePresence>
          </Tbody>
        </Table>
      </TableContainer>
    </Card>
  );
};
