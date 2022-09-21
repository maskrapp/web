import { Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import { AuthWrapper } from "../../components/auth/AuthWrapper";
import { Stats } from "../../components/dashboard/Stats";
import { DashboardNavigation } from "../../components/navigation/DashboardNavigation";
const Home: NextPage = () => {
  return (
    <AuthWrapper>
      <DashboardNavigation>
        <Heading>Stats</Heading>
        <Stats />
      </DashboardNavigation>
    </AuthWrapper>
  );
};

export default Home;
