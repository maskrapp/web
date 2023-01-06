import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormLabel,
  IconButton,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { accountDetails } from "../../../api/user";
import { useAxios } from "../../../hooks/useAxios";

export const AccountSection = () => {
  const axios = useAxios();
  // const { isEmailLogin } = useUser();
  const { data } = useQuery(["accountdetails"], () => accountDetails(axios));
  return (
    <Box w="25em">
      <Stack>
        <Box>
          <FormLabel>Display Name</FormLabel>
          <Flex direction="row" gap="3">
            <Input type="text" isReadOnly value={data?.name} />
            <IconButton
              aria-label="Change Name"
              icon={<EditIcon />}
              disabled
            />
          </Flex>
        </Box>
        <Box>
          <FormLabel>Email</FormLabel>
          <Flex direction="row" gap="3">
            <Input type="email" isReadOnly value={data?.email} />
            <IconButton
              aria-label="Change Email"
              icon={<EditIcon />}
              disabled
            />
          </Flex>
        </Box>
        <Box>
          <FormLabel>Password</FormLabel>
          <Flex direction="row" gap="3">
            <Input
              type="password"
              value="placeholder123"
              isReadOnly
            />
            <IconButton
              aria-label="Change Password"
              icon={<EditIcon />}
              disabled
            />
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};
