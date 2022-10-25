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
  const modal = useModal();
  return (
    <AuthWrapper>
      <DashboardHeader />
      <VStack h="100vh">
        {modal.createMaskModal.isOpen && (
          <CreateMaskModal closeFn={modal.createMaskModal.onClose} />
        )}
        {modal.createEmailModal.isOpen && (
          <CreateEmailModal closeFn={modal.createEmailModal.onClose} />
        )}
        {modal.verifyEmailModal.isOpen && (
          <VerifyEmailModal
            email={modal.verifyEmailModal.email}
            codeSent={modal.verifyEmailModal.codeSent}
            closeFn={modal.verifyEmailModal.onClose}
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
            <Masks openModalFn={modal.createMaskModal.onOpen} />
            <Emails openModalFn={modal.createEmailModal.onOpen} />
          </Box>
        </SimpleGrid>
      </VStack>
    </AuthWrapper>
  );
};

export default Index;
