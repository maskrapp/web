import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  FormLabel,
  Icon,
  IconButton,
  IconButtonProps,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { accountDetails } from "../../../api/user";
import { useAxios } from "../../../hooks/useAxios";
import { useUser } from "../../../hooks/useUser";

export const AccountSection = () => {
  const axios = useAxios();
  const { provider } = useUser();
  const { data } = useQuery(["accountdetails"], () => accountDetails(axios));
  return (
    <Box w="25em">
      <Stack>
        <Box>
          <FormLabel>Email</FormLabel>
          <InputWithEditIcon
            type="email"
            value={data?.email}
            iconButtonProps={{
              "aria-label": "Change email",
              isDisabled: provider !== "email",
            }}
          />
        </Box>
        <Box>
          <FormLabel>Password</FormLabel>
          <InputWithEditIcon
            type="password"
            value="placeholder123"
            isReadOnly
            iconButtonProps={{
              "aria-label": "Change password",
              isDisabled: provider !== "email",
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

type InputIconProps = InputProps & {
  iconButtonProps?: IconButtonProps;
};

const InputWithEditIcon = (
  { iconButtonProps, ...rest }: InputIconProps,
) => {
  return (
    <InputGroup size="lg">
      <Input readOnly {...rest} />
      <InputRightElement>
        <IconButton
          variant="ghost"
          icon={<Icon as={EditIcon} />}
          size="md"
          aria-label=""
          {...iconButtonProps}
        />
      </InputRightElement>
    </InputGroup>
  );
};
