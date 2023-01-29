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
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { fetchEmails } from "../../../api/email";

import { useAxios } from "../../../hooks/useAxios";
import { Email } from "../../../types";
import { Card } from "../../shared/Card";
import { CreateEmailModal } from "./CreateEmailModal";
import { EmailEntry } from "./EmailEntry";
import { VerifyEmailModal } from "./VerifyEmailModal";

export const Emails = () => {
  const axios = useAxios();

  const query = useQuery<Email[]>(["emails"], () => fetchEmails(axios), {
    cacheTime: 3600,
    refetchOnMount: false,
  });

  const { onOpen, onClose, isOpen } = useDisclosure();

  const { onOpen: onOpen2, onClose: onClose2, isOpen: isOpen2 } =
    useDisclosure();

  const [email, setEmail] = useState("");

  return (
    <>
      {isOpen && (
        <CreateEmailModal
          closeFn={onClose}
          onSuccess={(email: string) => {
            setEmail(email);
            onOpen2();
          }}
        />
      )}
      {isOpen2 && <VerifyEmailModal closeFn={onClose2} email={email} />}
      <Card pb="8">
        <Flex direction="row" justifyContent="space-between" mx="6">
          <Flex gap="2.5">
            <Text>Connected Emails</Text>
            <Spinner hidden={!query.isLoading} />
          </Flex>
          <Button variant={"outline"} onClick={onOpen}>
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
                    openVerificationModal={(email: string) => {
                      setEmail(email);
                      onOpen2();
                    }}
                  />
                ))}
              </AnimatePresence>
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};
