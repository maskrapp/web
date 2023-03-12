import { EditIcon } from "@chakra-ui/icons";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import {
  SettingsSection,
  SettingsSubsection,
} from "@/components/dashboard/settings/SettingsSection";
import { useUser } from "@/hooks/useUser";
import { accountDetails } from "@/api/account";
import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

export const AuthSection = () => {
  const { provider } = useUser();
  const isDisabled = provider !== "email";
  const axios = useAxios();
  const { data } = useQuery(["accountdetails"], () => accountDetails(axios), {
    cacheTime: 3600,
  });
  return (
    <SettingsSection name="Authentication">
      <SettingsSubsection name="Email">
        <InputGroup maxW="sm">
          <Input
            isReadOnly
            type="email"
            paddingRight="2.5rem"
            value={data?.email}
          />
          <InputRightElement width="2.5rem">
            <Button variant="ghost" isDisabled={isDisabled}>
              <EditIcon />
            </Button>
          </InputRightElement>
        </InputGroup>
        <SettingsSubsection>
          <Button colorScheme="messenger" isDisabled={isDisabled}>
            Change Password
          </Button>
        </SettingsSubsection>
      </SettingsSubsection>
    </SettingsSection>
  );
};
