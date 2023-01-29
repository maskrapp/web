import { Box, ChakraProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = ChakraProps & {
  children: ReactNode;
};

export const Card = ({ children, ...rest }: Props) => {
  return (
    <Box
      margin={"auto"}
      mt="10"
      pt="4"
      pb="4"
      rounded="base"
      bgColor={"blackAlpha.300"}
      overflowX="auto"
      overflowY="hidden"
      border={"1px solid"}
      borderColor="gray.500"
      {...rest}
    >
      {children}
    </Box>
  );
};
