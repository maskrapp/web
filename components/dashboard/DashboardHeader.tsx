import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Flex,
  HStack,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { revokeRefreshToken } from "@/api/token";

export const Logo = () => {
  return (
    <HStack>
      <Text fontSize={"md"} fontWeight="700">Maskr</Text>
      <Badge colorScheme="blue">Alpha</Badge>
    </HStack>
  );
};

export const DashboardHeader = () => {
  const { mutateAsync } = useMutation(async () =>
    revokeRefreshToken(localStorage.getItem("refresh_token") ?? "")
  );
  return (
    <Flex
      justify="center"
      borderBottom={"1px solid"}
      bgColor={"blackAlpha.300"}
      borderColor="gray.300"
    >
      <Flex
        justify="space-between"
        alignItems="center"
        h="16"
        maxW="1000px"
        flex="1"
      >
        <HStack
          spacing={{
            md: 20,
            base: "16",
          }}
        >
          <Logo />
          <HStack
            spacing={{
              base: 2,
              md: 5,
            }}
          >
            <NavItem name="Masks" href="/" />
            <NavItem name="Emails" href="/emails" />
          </HStack>
        </HStack>
        <HStack>
          <Menu placement="bottom-end">
            <MenuButton as={Button} variant="outline" px="2">
              <HStack>
                <span>Actions</span>
                <ChevronDownIcon />
              </HStack>
            </MenuButton>
            <MenuList>
              <Link href="/settings">
                <MenuItem>
                  <HStack>
                    <SettingsIcon />
                    <Text>Settings</Text>
                  </HStack>
                </MenuItem>
              </Link>
              <MenuItem
                color="red.400"
                onClick={async () => {
                  await mutateAsync();
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("refresh_token");
                  window.location.assign("/");
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Flex>
  );
};

interface NavItemProps {
  name: string;
  href: string;
}

const NavItem = ({ name, href }: NavItemProps) => {
  return (
    <Link href={href}>
      <ChakraLink
        px={2}
        py={1}
        rounded={"base"}
        _hover={{
          textDecoration: "none",
          bg: "gray.700",
        }}
        href={"#"}
      >
        {name}
      </ChakraLink>
    </Link>
  );
};
