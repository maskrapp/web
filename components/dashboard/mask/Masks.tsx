import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { useAxios } from "../../../hooks/useAxios";
import { BACKEND_URL } from "../../../utils/constants";
import { MaskEntry } from "./MaskEntry";

interface MaskEntry {
  mask: string;
  email: string;
  enabled: boolean;
}
const fetchMasks = async (axios: AxiosInstance) => {
  const response = await axios.post<MaskEntry[]>("/api/user/masks");
  return response.data ?? [];
};

const makeDeleteMaskRequest = (axios: AxiosInstance, mask: string) => {
  return axios.delete(`${BACKEND_URL}/api/user/delete-mask`, {
    data: { mask: mask },
  });
};
interface Props {
  openFn: () => void;
}

export const Masks = ({ openFn }: Props) => {
  const axios = useAxios();

  const toast = useToast();

  const queryClient = useQueryClient();

  const query = useQuery<MaskEntry[], Error>(
    ["masks"],
    () => fetchMasks(axios),
    {
      cacheTime: 3600,
      refetchOnMount: false,
    }
  );

  const masks = query.data ?? [];
  return (
    <Box
      margin={"auto"}
      mt="10"
      pt="4"
      pb="4"
      bgColor={"blackAlpha.300"}
      overflowX="auto"
      overflowY="hidden"
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
    >
      <Flex direction="row" mx="6" justifyContent="space-between">
        <Text>Masks</Text>
        <Button variant={"outline"} onClick={openFn}>
          Create Mask
        </Button>
      </Flex>
      <Table variant="unstyled">
        <Thead>
          <Tr>
            <Th>Mask</Th>
            <Th>Email</Th>
            <Th>Enabled</Th>
          </Tr>
        </Thead>
        <Tbody>
          {masks.map((mask) => (
            <MaskEntry
              key={mask.mask}
              email={mask.email}
              mask={mask.mask}
              enabled={mask.enabled}
            />
          ))}
        </Tbody>
        <Tfoot />
      </Table>
    </Box>
  );
};
