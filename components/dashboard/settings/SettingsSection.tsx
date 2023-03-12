import { Box, Divider, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";

interface SectionProps {
  name?: string;
  children: ReactNode;
  hideDivider?: boolean;
}

export const SettingsSection = ({
  name,
  children,
  hideDivider = false,
}: SectionProps) => {
  return (
    <Box my="4">
      <Heading letterSpacing="tighter" fontWeight="medium" size="lg" mb="2">
        {name}
      </Heading>
      {children}
      {!hideDivider && <Divider mt="7" />}
    </Box>
  );
};

interface SubsectionProps {
  name?: string;
  children: ReactNode;
}

export const SettingsSubsection = ({ name, children }: SubsectionProps) => {
  return (
    <Box my="5">
      <Heading fontWeight="medium" color="gray.200" size="sm" mb="3">
        {name}
      </Heading>
      {children}
    </Box>
  );
};
