import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export const AuthCard = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      rounded={"lg"}
      bg="blackAlpha.300"
      w="25em"
      boxShadow={"lg"}
      p={8}
    >
      {children}
    </Box>
  );
};
