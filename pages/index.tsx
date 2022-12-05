import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { AuthWrapper } from "../components/auth/AuthWrapper";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { CreateEmailModal } from "../components/dashboard/email/CreateEmailModal";
import { CreateMaskModal } from "../components/dashboard/mask/CreateMaskModal";
import { Masks } from "../components/dashboard/mask/Masks";
import { MaskStats } from "../components/dashboard/mask/MaskStats";
import { useModal } from "../hooks/useModal";

const Index: NextPage = () => {
  const { createMaskModal, createEmailModal } = useModal();
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
        {createMaskModal.isOpen && (
          <CreateMaskModal closeFn={createMaskModal.onClose} />
        )}
        {createEmailModal.isOpen && (
          <CreateEmailModal closeFn={createEmailModal.onClose} />
        )}

        <Box
          margin="auto"
          boxSize={{
            md: "4xl",
            base: "100%",
          }}
        >
          <MaskStats />
          <Masks openModalFn={createMaskModal.onOpen} />
        </Box>
      </AuthWrapper>
    </>
  );
};

export default Index;
