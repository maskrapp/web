import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";

//TODO: implement this later
export const MaskStats = () => {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard title={"Total Masks"} stat={"1"} />
        <StatsCard title={"Mails forwarded"} stat={"0"} />
        <StatsCard title={"Mails received"} stat={"0"} />
      </SimpleGrid>
    </Box>
  );
};
interface Props {
  title: string;
  stat: string;
  icon?: ReactNode;
}

const StatsCard = (props: Props) => {
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
      bgColor="blackAlpha.300"
    >
      <Flex justifyContent={"space-between"}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={"medium"}>{title}</StatLabel>
          <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent={"center"}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
};
