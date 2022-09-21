import { Box, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { AuthWrapper } from "../../components/auth/AuthWrapper";
import { Masks } from "../../components/dashboard/Masks";
import { DashboardNavigation } from "../../components/navigation/DashboardNavigation";

const MasksPage: NextPage = () => {
  return (
    <AuthWrapper>
      <DashboardNavigation>
        <Heading>Masks</Heading>
        <Box
          w={{
            md: "100%",
            sm: "100%",
            lg: "65",
            xl: "50%",
          }}
        >
          <Masks />
        </Box>
      </DashboardNavigation>
    </AuthWrapper>
  );
};

export default MasksPage;
