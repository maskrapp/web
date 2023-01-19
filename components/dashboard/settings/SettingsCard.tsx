import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Card } from "../../shared/Card";
import { AccountSection } from "./AccountSection";
import { BillingSection } from "./BillingSection";
import { PrivacySection } from "./PrivacySection";

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
