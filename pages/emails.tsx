import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Emails } from "@/components/dashboard/email/Emails";
import Head from "next/head";
import { AuthenticatedGuard } from "@/components/auth/guards/AuthenticatedGuard";

const EmailPage: NextPage = () => {
  return (
    <AuthenticatedGuard>
      <Head>
        <title>Emails - Maskr</title>
      </Head>
      <DashboardHeader />
      <Box
        px="3"
        margin="auto"
        boxSize={{
          md: "4xl",
          base: "100%",
        }}
      >
        <Emails />
      </Box>
    </AuthenticatedGuard>
  );
};

export default EmailPage;
