import { NextPage } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Head from "next/head";
import { AuthenticatedGuard } from "@/components/auth/guards/AuthenticatedGuard";
import { SettingsLayout } from "@/components/dashboard/settings/SettingsLayout";
import { AuthSection } from "@/components/dashboard/settings/sections/general/Authentication";
import { AccountRemovalSection } from "@/components/dashboard/settings/sections/general/AccountRemoval";

const Settings: NextPage = () => {
  return (
    <AuthenticatedGuard>
      <Head>
        <title>Settings - Maskr</title>
      </Head>
      <DashboardHeader />
      <SettingsLayout>
        <AuthSection />
        <AccountRemovalSection />
      </SettingsLayout>
    </AuthenticatedGuard>
  );
};
export default Settings;
