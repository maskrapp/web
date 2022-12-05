import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { AuthWrapper } from "../components/auth/AuthWrapper";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { CreateEmailModal } from "../components/dashboard/email/CreateEmailModal";
import { Emails } from "../components/dashboard/email/Emails";
import { VerifyEmailModal } from "../components/dashboard/email/VerifyEmailModal";
import { useModal } from "../hooks/useModal";

const EmailPage: NextPage = () => {
  const { createEmailModal, verifyEmailModal } = useModal();
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
        {createEmailModal.isOpen && (
          <CreateEmailModal closeFn={createEmailModal.onClose} />
        )}
        {verifyEmailModal.isOpen && (
          <VerifyEmailModal
            email={verifyEmailModal.email}
            codeSent={verifyEmailModal.codeSent}
            closeFn={verifyEmailModal.onClose}
          />
        )}

        <Box
          margin="auto"
          boxSize={{
            md: "4xl",
            base: "100%",
          }}
        >
          <Emails openModalFn={createEmailModal.onOpen} />
        </Box>
      </AuthWrapper>
    </>
  );
};

export default EmailPage;
