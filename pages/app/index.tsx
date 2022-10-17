import { Box, SimpleGrid, useDisclosure, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { AuthWrapper } from "../../components/auth/AuthWrapper";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { EmailModal } from "../../components/dashboard/email/EmailModal";
import { Emails } from "../../components/dashboard/email/Emails";
import { CreateMaskModal } from "../../components/dashboard/mask/CreateMaskModal";
import { Masks } from "../../components/dashboard/mask/Masks";
import { MaskStats } from "../../components/dashboard/mask/MaskStats";

const Index: NextPage = () => {
  const emailDisclosure = useDisclosure();
  const maskDisclosure = useDisclosure();
  return (
    <AuthWrapper>
      <VStack h="100vh">
        <DashboardHeader />
        {maskDisclosure.isOpen && (
          <CreateMaskModal closeFn={maskDisclosure.onClose} />
        )}
        {emailDisclosure.isOpen && (
          <EmailModal closeFn={emailDisclosure.onClose} />
        )}
        <SimpleGrid columns={1}>
          <Box>
            <MaskStats />
            <Masks openFn={maskDisclosure.onOpen} />
            <Emails openModalFn={emailDisclosure.onOpen} />
          </Box>
        </SimpleGrid>
      </VStack>
    </AuthWrapper>
  );
};
export default Index;
