import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { AuthWrapper } from "../components/auth/AuthWrapper";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Emails } from "../components/dashboard/email/Emails";

const EmailPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Maskr - Emails</title>
        <meta property="og:title" content="Maskr" key="title" />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
      </Head>
      <AuthWrapper>
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
    </>
  );
};

export default EmailPage;
