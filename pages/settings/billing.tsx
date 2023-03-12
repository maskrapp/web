import { AuthenticatedGuard } from "@/components/auth/guards/AuthenticatedGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SettingsLayout } from "@/components/dashboard/settings/SettingsLayout";
import { NextPage } from "next";
import Head from "next/head";

const Billing: NextPage = () => {
  return (
    <AuthenticatedGuard>
      <Head>
        <title>Settings - Maskr</title>
      </Head>
      <DashboardHeader />
      <SettingsLayout></SettingsLayout>
    </AuthenticatedGuard>
  );
};
export default Billing;
