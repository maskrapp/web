import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  Switch,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { deleteMask, setMaskStatus } from "../../../api/mask";

import { useAxios } from "../../../hooks/useAxios";
import { APIResponse, Mask } from "../../../types";
import { ConfirmationModal } from "../ConfirmationModal";

interface MaskEntryProps {
  mask: string;
  email: string;
  enabled: boolean;
}

const MotionTr = motion(Tr);

export const MaskEntry = ({ mask, email, enabled }: MaskEntryProps) => {
  const axios = useAxios();

  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (mask: string) => deleteMask(axios, mask),
    {
      onSuccess: () => {
        const masks = queryClient.getQueryData<Mask[]>(["masks"]);
        queryClient.setQueryData(
          ["masks"],
          masks?.filter((entry) => entry.mask !== mask),
        );
        toast({
          title: "Deleted Mask",
          status: "success",
          position: "top",
          isClosable: true,
          duration: 3000,
        });
      },
    },
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {isOpen && (
        <ConfirmationModal
          submitAction={() => mutate(mask)}
          onClose={onClose}
          text="This action cannot be reversed, are you sure you want to delete this mask?"
          submitButtonText="Delete Mask"
        />
      )}
      <MotionTr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Td>{mask}</Td>
        <Td>{email}</Td>
        <Td>
          <MaskEntrySwitch mask={mask} enabled={enabled} />
        </Td>
        <Td>
          <HStack>
            <IconButton
              aria-label="Edit Mask"
              icon={<EditIcon />}
            />
            <IconButton
              colorScheme="red"
              aria-label="Delete Mask"
              icon={<DeleteIcon />}
              onClick={onOpen}
            />
          </HStack>
        </Td>
      </MotionTr>
    </>
  );
};

const MaskEntrySwitch = ({
  enabled,
  mask,
}: Omit<MaskEntryProps, "email" | "deleteFn">) => {
  const [value, setValue] = useState(enabled);

  const axios = useAxios();

  const toast = useToast();
  const { mutate } = useMutation(
    ({ value, mask }: Pick<MaskEntryProps, "mask"> & { value: boolean }) => {
      return setMaskStatus(axios, { mask, value });
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
    },
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
