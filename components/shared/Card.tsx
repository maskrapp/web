import { Box, ChakraProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface Props {
  props?: ChakraProps;
}

export const Card = ({ children, props }: PropsWithChildren<Props>) => {
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
      {...props}
    >
      {children}
    </Box>
  );
};
