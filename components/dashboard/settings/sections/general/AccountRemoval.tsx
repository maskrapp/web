import { Button } from "@chakra-ui/react";
import {
  SettingsSection,
  SettingsSubsection,
} from "components/dashboard/settings/SettingsSection";

export const AccountRemovalSection = () => {
  return (
    <SettingsSection name="Account removal" hideDivider>
      <SettingsSubsection>
        <Button colorScheme="red" isDisabled>
          Delete Account
        </Button>
      </SettingsSubsection>
    </SettingsSection>
  );
};
