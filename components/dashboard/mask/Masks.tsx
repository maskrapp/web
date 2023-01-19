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
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { fetchMasks } from "../../../api/mask";

import { useAxios } from "../../../hooks/useAxios";
import { Mask } from "../../../types";
import { Card } from "../../shared/Card";
import { MaskEntry } from "./MaskEntry";

interface Props {
  openModalFn: () => void;
}

export const Masks = ({ openModalFn }: Props) => {
  const axios = useAxios();

  const { data, isLoading } = useQuery<Mask[], Error>(
    ["masks"],
    () => fetchMasks(axios),
    {
      refetchOnMount: true,
    },
  );

  return (
    <Card>
      <Flex direction="row" mx="6" justifyContent="space-between">
        <Flex gap="2.5">
          <Text>Masks</Text>
          <Spinner hidden={!isLoading} />
        </Flex>
        <Button variant={"outline"} onClick={openModalFn}>
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
  );
};
