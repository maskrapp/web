import { HStack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

export const Stats = () => {
  return (
    <HStack gap="">
      <Stat>
        <StatLabel>Emails forwarded</StatLabel>
        <StatNumber>200</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>Emails forwarded</StatLabel>
        <StatNumber>200</StatNumber>
      </Stat>
      <Stat>
        <StatLabel>Emails forwarded</StatLabel>
        <StatNumber>200</StatNumber>
      </Stat>
    </HStack>
  );
};
