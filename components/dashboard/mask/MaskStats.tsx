import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";
import { fetchMasks } from "@/api/mask";
import { useAxios } from "@/hooks/useAxios";
import { Mask } from "@/types";

export const MaskStats = () => {
  const axios = useAxios();
  const { data } = useQuery<Mask[], Error>(
    ["masks"],
    () => fetchMasks(axios),
  );

  const maskCount = !!data ? data.length : 0;

  const [messagesForwarded, messagesReceived] = useMemo(() => {
    let forwarded = 0;
    let received = 0;

    data?.forEach((mask) => {
      forwarded += mask.messages_forwarded;
      received += mask.messages_received;
    });

    return [forwarded, received];
  }, [data]);

  return (
    <Box maxW="7xl" mx={"auto"} pt={5}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard title={"Total Masks"} stat={maskCount} />
        <StatsCard title={"Messages Received"} stat={messagesReceived} />
        <StatsCard title={"Messages Forwarded"} stat={messagesForwarded} />
      </SimpleGrid>
    </Box>
  );
};

interface Props {
  title: string;
  stat: string | number;
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
