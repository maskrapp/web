import { Box, SimpleGrid, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { AuthWrapper } from "../components/auth/AuthWrapper";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { CreateEmailModal } from "../components/dashboard/email/CreateEmailModal";
import { Emails } from "../components/dashboard/email/Emails";
import { VerifyEmailModal } from "../components/dashboard/email/VerifyEmailModal";
import { CreateMaskModal } from "../components/dashboard/mask/CreateMaskModal";
import { Masks } from "../components/dashboard/mask/Masks";
import { MaskStats } from "../components/dashboard/mask/MaskStats";
import { useModal } from "../hooks/useModal";

const Index: NextPage = () => {
  const { createMaskModal, createEmailModal, verifyEmailModal } = useModal();
  return (
    <AuthWrapper>
      <DashboardHeader />
      <VStack h="100vh">
        {createMaskModal.isOpen && (
          <CreateMaskModal closeFn={createMaskModal.onClose} />
        )}
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

        <SimpleGrid columns={1}>
          <Box
            boxSize={{
              md: "4xl",
              base: "100%",
            }}
          >
            <MaskStats />
            <Masks openModalFn={createMaskModal.onOpen} />
            <Emails openModalFn={createEmailModal.onOpen} />
          </Box>
        </SimpleGrid>
      </VStack>
    </AuthWrapper>
  );
};

export default Index;
