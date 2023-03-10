import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Masks } from "@/components/dashboard/mask/Masks";
import { MaskStats } from "@/components/dashboard/mask/MaskStats";
import { AuthenticatedGuard } from "@/components/auth/guards/AuthenticatedGuard";

const Index: NextPage = () => {
  return (
    <AuthenticatedGuard>
      <DashboardHeader />
      <Box
        px="3"
        margin="auto"
        boxSize={{
          md: "4xl",
          base: "100%",
        }}
      >
        <MaskStats />
        <Masks />
      </Box>
    </AuthenticatedGuard>
  );
};

export default Index;
