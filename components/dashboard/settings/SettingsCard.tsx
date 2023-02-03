import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Card } from "@/components/shared/Card";
import { AccountSection } from "@/components/dashboard/settings/AccountSection";
import { BillingSection } from "@/components/dashboard/settings/BillingSection";
import { PrivacySection } from "@/components/dashboard/settings/PrivacySection";

export const SettingsCard = () => {
  return (
    <Card>
      <Tabs align="center">
        <TabList>
          <Tab>Account</Tab>
          <Tab>Privacy</Tab>
          <Tab>Billing</Tab>
        </TabList>
        <TabPanels my="1">
          <TabPanel>
            <AccountSection />
          </TabPanel>
          <TabPanel>
            <PrivacySection />
          </TabPanel>
          <TabPanel>
            <BillingSection />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  );
};
