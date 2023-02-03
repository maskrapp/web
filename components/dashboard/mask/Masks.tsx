import {
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { fetchMasks } from "@/api/mask";

import { useAxios } from "@/hooks/useAxios";
import { Mask } from "@/types";
import { Card } from "@/components/shared/Card";
import { CreateMaskModal } from "@/components/dashboard/mask/CreateMaskModal";
import { MaskEntry } from "@/components/dashboard/mask/MaskEntry";

export const Masks = () => {
  const axios = useAxios();

  const { data, isLoading } = useQuery<Mask[], Error>(
    ["masks"],
    () => fetchMasks(axios),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <>
      {isOpen && <CreateMaskModal closeFn={onClose} />}
      <Card pb="8">
        <Flex direction="row" mx="6" justifyContent="space-between">
          <Flex gap="2.5">
            <Text>Masks</Text>
            <Spinner hidden={!isLoading} />
          </Flex>
          <Button variant={"outline"} onClick={onOpen}>
            Create Mask
          </Button>
        </Flex>
        <TableContainer overflow="auto">
          <Table variant="unstyled">
            <Thead>
              <Tr>
                <Th>Mask</Th>
                <Th>Email</Th>
                <Th>Enabled</Th>
              </Tr>
            </Thead>
            <Tbody>
              <AnimatePresence>
                {data?.map((mask) => (
                  <MaskEntry
                    key={mask.mask}
                    email={mask.email}
                    mask={mask.mask}
                    enabled={mask.enabled}
                  />
                ))}
              </AnimatePresence>
            </Tbody>
            <Tfoot />
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};
