import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SettingsCard } from "@/components/dashboard/settings/SettingsCard";
import Head from "next/head";
import { AuthenticatedGuard } from "@/components/auth/guards/AuthenticatedGuard";

const Settings: NextPage = () => {
  return (
    <AuthenticatedGuard>
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
    </AuthenticatedGuard>
  );
};
export default Settings;
