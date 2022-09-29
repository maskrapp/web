import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
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
import { SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { APIResponse, Mask } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";
import { ConfirmationModal } from "../ConfirmationModal";
import { CreateMaskModal } from "./CreateMaskModal";

interface Props {
  supabaseClient: SupabaseClient;
}

export const Masks = ({ supabaseClient }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchMasks = async () => {
    const result = await supabaseClient.from<Mask>("masks").select(`
        mask,
        enabled,
        emails (
          email
        )
      `);
    return result.data ?? [];
  };

  const query = useQuery<Mask[], Error>(["masks"], fetchMasks, {
    cacheTime: 3600,
    refetchOnMount: false,
  });
  const masks = query.data ?? [];

  return (
    <TableContainer
      // boxSize={{ //   base: "100%", // 0-48em
      //   md: "50%", // 48em-80em,
      //   xl: "40%", // 80em+ // }}
      boxSize={"60%"}
    >
      {isOpen && (
        <CreateMaskModal onClose={onClose} supabaseClient={supabaseClient} />
      )}
      <Button onClick={() => onOpen()}>Create Mask</Button>
      <Table variant="unstyled">
        <Thead>
          <Tr>
            <Th>Mask</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {masks.map((mask) => (
            <MaskEntry
              key={mask.mask}
              mask={mask.mask}
              email={mask.emails.email}
              enabled={mask.enabled}
            />
          ))}
        </Tbody>
        <Tfoot></Tfoot>
      </Table>
    </TableContainer>
  );
};

interface MaskEntryProps {
  mask: string;
  email: string;
  enabled: boolean;
}

const MaskEntry = ({ mask, email, enabled }: MaskEntryProps) => {
  const makeDeleteMaskRequest = (mask: string) => {
    const jsonStr = localStorage.getItem("supabase.auth.token");
    const data = JSON.parse(jsonStr ?? "{}");
    return axios.delete(`${BACKEND_URL}/api/user/delete-mask`, {
      data: { mask: mask },
      headers: {
        Authorization: data.currentSession.access_token,
      },
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

  const makeUpdateStatusRequest = (value: boolean, mask: string) => {
    const jsonStr = localStorage.getItem("supabase.auth.token");
    const data = JSON.parse(jsonStr ?? "{}");
    return axios.put(
      `${BACKEND_URL}/api/user/set-mask-status`,
      {
        mask,
        value,
      },
      {
        headers: {
          Authorization: data.currentSession.access_token,
        },
      }
    );
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
      onChange={(event) => {
        const newValue = !value;
        setValue(newValue);
        setTimeout(() => {
          mutate({ value: newValue, mask: mask });
        }, 50);
      }}
    />
  );
};
