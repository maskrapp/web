import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { AuthWrapper } from "../../components/auth/AuthWrapper";
import { Emails } from "../../components/dashboard/email/Emails";
import { Masks } from "../../components/dashboard/mask/Masks";
import { DashboardNavigation } from "../../components/navigation/DashboardNavigation";
import { useUser } from "../../context/UserContext";

const MasksPage: NextPage = () => {
  const { supabase } = useUser();
  return (
    <AuthWrapper>
      <DashboardNavigation>
        <Heading>Masks</Heading>
        <Tabs isLazy>
          <TabList>
            <Tab>Masks</Tab>
            <Tab>Emails</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Masks supabaseClient={supabase} />
            </TabPanel>
            <TabPanel>
              <Emails supabaseClient={supabase} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DashboardNavigation>
    </AuthWrapper>
  );
};

export default MasksPage;
