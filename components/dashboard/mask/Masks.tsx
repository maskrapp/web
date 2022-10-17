import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useAxios } from "../../../hooks/useAxios";
import { APIResponse, Mask } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";
import { ConfirmationModal } from "../ConfirmationModal";

interface MaskEntry {
  mask: string;
  email: string;
  enabled: boolean;
}

interface Props {
  openFn: () => void;
}

export const Masks = ({ openFn }: Props) => {
  const axios = useAxios();

  const fetchMasks = async () => {
    const response = await axios.post<MaskEntry[]>("/api/user/masks");
    return response.data ?? [];
  };

  const query = useQuery<MaskEntry[], Error>(["masks"], fetchMasks, {
    cacheTime: 3600,
    refetchOnMount: false,
  });
  const masks = query.data ?? [];
  return (
    <Box
      margin={"auto"}
      maxW="100%"
      mt="10"
      pt="4"
      pb="4"
      bgColor={"blackAlpha.300"}
      overflow="auto"
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      maxHeight="fit-content"
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
              enabled={mask.enabled}
              mask={mask.mask}
            />
          ))}
        </Tbody>
        <Tfoot />
      </Table>
    </Box>
  );
};

interface MaskEntryProps {
  mask: string;
  email: string;
  enabled: boolean;
}

export const MaskEntry = ({ mask, email, enabled }: MaskEntryProps) => {
  const axios = useAxios();
  const makeDeleteMaskRequest = (mask: string) => {
    return axios.delete(`${BACKEND_URL}/api/user/delete-mask`, {
      data: { mask: mask },
    });
  };

  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (mask: string) => makeDeleteMaskRequest(mask),
    {
      onSuccess: () => {
        const masks = queryClient.getQueryData<Mask[]>(["masks"]);
        queryClient.setQueryData(
          ["masks"],
          masks?.filter((entry) => entry.mask !== mask)
        );
        toast({
          title: "Deleted Mask",
          status: "success",
          position: "top",
          isClosable: true,
          duration: 3000,
        });
      },
    }
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {isOpen && (
        <ConfirmationModal
          submitAction={() => mutate(mask)}
          onClose={onClose}
          text="placeholder"
          submitButtonText="Delete Mask"
        />
      )}
      <Tr>
        <Td>{mask}</Td>
        <Td>{email}</Td>
        <Td>
          <MaskEntrySwitch mask={mask} enabled={enabled} />
        </Td>
        <Td>
          <Menu>
            <MenuButton as={Button}>
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
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

const MaskEntrySwitch = ({ enabled, mask }: Omit<MaskEntryProps, "email">) => {
  const [value, setValue] = useState(enabled);

  const axios = useAxios();

  const makeUpdateStatusRequest = (value: boolean, mask: string) => {
    const jsonStr = localStorage.getItem("supabase.auth.token");
    const data = JSON.parse(jsonStr ?? "{}");
    return axios.put(`${BACKEND_URL}/api/user/set-mask-status`, {
      mask,
      value,
    });
  };

  interface Args {
    value: boolean;
    mask: string;
  }
  const toast = useToast();
  const { mutate } = useMutation(
    (args: Args) => {
      return makeUpdateStatusRequest(args.value, args.mask);
    },
    {
      onError: (data: AxiosError<APIResponse, any>) => {
        toast({
          title: "Error",
          description: data.response?.data?.message,
          status: "error",
          position: "top",
          isClosable: true,
        });
        setValue(!value);
      },
    }
  );
  useEffect(() => {
    setValue(enabled);
  }, [enabled]);
  return (
    <Switch
      isChecked={value}
      onChange={(_) => {
        const newValue = !value;
        setValue(newValue);
        setTimeout(() => {
          mutate({ value: newValue, mask: mask });
        }, 50);
      }}
    />
  );
};
