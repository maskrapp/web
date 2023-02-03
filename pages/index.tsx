import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Masks } from "@/components/dashboard/mask/Masks";
import { MaskStats } from "@/components/dashboard/mask/MaskStats";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Maskr</title>
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
          <MaskStats />
          <Masks />
        </Box>
      </AuthWrapper>
    </>
  );
};

export default Index;
