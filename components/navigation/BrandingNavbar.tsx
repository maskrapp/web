import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const Links = ["Features", "Pricing", "Team"];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export const BrandingNavbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>Maskr</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <NavLink>Features</NavLink>
              <NavLink>Pricing</NavLink>
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Button
              bgColor="green.600"
              _hover={{
                bg: "green.500",
              }}
              _active={{
                bg: "green.500",
              }}
              onClick={() => router.push("/app")}
            >
              Open App
            </Button>
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};
