import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SettingsCard } from "@/components/dashboard/settings/SettingsCard";
import Head from "next/head";

const Settings: NextPage = () => {
  return (
    <AuthWrapper>
      <Head>
        <title>Settings - Maskr</title>
      </Head>
      <DashboardHeader />
      <Box
        margin="auto"
        boxSize={{
          md: "4xl",
          base: "100%",
        }}
      >
        <SettingsCard />
      </Box>
    </AuthWrapper>
  );
};
export default Settings;
