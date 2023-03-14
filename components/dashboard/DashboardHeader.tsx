import { FaMask } from "react-icons/fa";
import { MdEmail, MdSettings } from "react-icons/md";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { revokeRefreshToken } from "@/api/token";
import { useMutation } from "@tanstack/react-query";
import { JSXElementConstructor, ReactElement } from "react";

export const Logo = () => {
  return (
    <HStack>
      <Text fontSize={"md"} fontWeight="700">
        Maskr
      </Text>
      <Badge colorScheme="blue">Alpha</Badge>
    </HStack>
  );
};

export const DashboardHeader = () => {
  const { mutateAsync } = useMutation(async (token: string) =>
    revokeRefreshToken(token)
  );
  return (
    <Box
      borderBottom={"1px solid"}
      bgColor={"blackAlpha.300"}
      borderColor="gray.300"
      mb="8"
    >
      <Container maxW="container.lg">
        <Flex
          justify="space-between"
          alignItems="center"
          h="16"
          maxW="1000px"
          flex="1"
        >
          <HStack
            w="full"
            spacing={{
              md: 20,
              base: "16",
            }}
          >
            <Logo />
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
                <MenuItem
                  color="red.400"
                  onClick={async () => {
                    await mutateAsync(
                      localStorage.getItem("refresh_token") as string
                    );
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.assign("/signin");
                  }}
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        <Navigation />
      </Container>
    </Box>
  );
};

const Navigation = () => {
  return (
    <ButtonGroup>
      <NavItem name="Masks" icon={<FaMask />} href="/" />
      <NavItem name="Emails" icon={<MdEmail />} href="/emails" />
      <NavItem name="Settings" icon={<MdSettings />} href="/settings" />
    </ButtonGroup>
  );
};

interface NavItemProps {
  name: string;
  href: string;
  icon?: ReactElement<any, string | JSXElementConstructor<any>>;
}

const NavItem = ({ name, href, icon }: NavItemProps) => {
  const selected = window.location.pathname === href;
  return (
    <Button
      as={Link}
      leftIcon={icon}
      variant="ghost"
      rounded="sm"
      href={href}
      _hover={{ textDecoration: "none", bgColor: "whiteAlpha.200" }}
      borderBottom={selected ? "2px solid" : undefined}
    >
      {name}
    </Button>
  );
};
