import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { AuthWrapper } from "../../components/auth/AuthWrapper";
import { DashboardNavigation } from "../../components/navigation/DashboardNavigation";

const MasksPage: NextPage = () => {
  return (
    <AuthWrapper>
      <DashboardNavigation>
        <Heading>Settings</Heading>
      </DashboardNavigation>
    </AuthWrapper>
  );
};

export default MasksPage;
