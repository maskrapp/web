import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Emails } from "@/components/dashboard/email/Emails";
import Head from "next/head";

const EmailPage: NextPage = () => {
  return (
    <AuthWrapper>
      <Head>
        <title>Emails - Maskr</title>
      </Head>
      <DashboardHeader />
      <Box
        margin="auto"
        boxSize={{
          md: "4xl",
          base: "100%",
        }}
      >
        <Emails />
      </Box>
    </AuthWrapper>
  );
};

export default EmailPage;
