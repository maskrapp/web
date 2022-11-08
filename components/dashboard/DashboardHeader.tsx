import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  HStack,
  Icon,
  IconProps,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";

export const Logo = (props?: IconProps) => {
  // THIS IS A PLACEHOLDER; replace this later
  return (
    <Icon
      id="logo-72"
      width="52"
      height="44"
      viewBox="0 0 53 44"
      fill="#FFFFFF"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M23.2997 0L52.0461 28.6301V44H38.6311V34.1553L17.7522 13.3607L13.415 13.3607L13.415 44H0L0 0L23.2997 0ZM38.6311 15.2694V0L52.0461 0V15.2694L38.6311 15.2694Z"
        className="ccustom"
        fill="#212326"
      ></path>
    </Icon>
  );
};

export const DashboardHeader = () => {
  const toast = useToast();
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
          <Logo boxSize={"30px"} color="red" />
          <HStack
            spacing={{
              base: 2,
              md: 5,
            }}
          >
            <NavItem name="Dashboard" href="/" />
            <NavItem name="Settings" href="/settings" />
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
              <MenuItem
                color="red.400"
                onClick={() => {
                  localStorage.removeItem("tokens");
                  window.location.assign("/signin");
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
