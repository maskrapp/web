import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { AuthWrapper } from "../components/auth/AuthWrapper";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";

const Settings: NextPage = () => {
  return (
    <AuthWrapper>
      <DashboardHeader />
      <Heading>Settings</Heading>
    </AuthWrapper>
  );
};

export default Settings;
