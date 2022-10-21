import { Box, SimpleGrid, useDisclosure, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { AuthWrapper } from "../components/auth/AuthWrapper";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { CreateEmailModal } from "../components/dashboard/email/CreateEmailModal";
import { Emails } from "../components/dashboard/email/Emails";
import { CreateMaskModal } from "../components/dashboard/mask/CreateMaskModal";
import { Masks } from "../components/dashboard/mask/Masks";
import { MaskStats } from "../components/dashboard/mask/MaskStats";

const Index: NextPage = () => {
  const emailDisclosure = useDisclosure();
  const maskDisclosure = useDisclosure();
  return (
    <AuthWrapper>
      <DashboardHeader />
      <VStack h="100vh">
        {maskDisclosure.isOpen && (
          <CreateMaskModal closeFn={maskDisclosure.onClose} />
        )}
        {emailDisclosure.isOpen && (
          <CreateEmailModal closeFn={emailDisclosure.onClose} />
        )}
        <SimpleGrid columns={1}>
          <Box>
            <MaskStats />
            <Masks openModalFn={maskDisclosure.onOpen} />
            <Emails openModalFn={emailDisclosure.onOpen} />
          </Box>
        </SimpleGrid>
      </VStack>
    </AuthWrapper>
  );
};
export default Index;
