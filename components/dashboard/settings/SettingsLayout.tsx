import { Box, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { SettingsNavigation } from "./SettingsNavigation";

interface Props {
  children?: ReactNode;
}

const settingsRoutes: Record<string, string> = {
  "/settings": "General",
  "/settings/billing": "Billing",
};

export const SettingsLayout = ({ children }: Props) => {
  const router = useRouter();
  const heading = settingsRoutes[router.pathname];
  return (
    <Box
      maxW="container.lg"
      marginLeft={{ sm: 0, md: "auto" }}
      marginRight={{ sm: 0, md: "auto" }}
    >
      <Box display={{ base: "block", md: "flex" }} mx="5" mt="16">
        <SettingsNavigation />
        <Box flex="1" ml={{ md: "40" }}>
          <Heading letterSpacing="tight" pb="5">
            {heading}
          </Heading>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
