import {
  Flex,
  Link as ChakraLink,
  Select,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

interface SettingsItem {
  name: string;
  href: string;
}

const items: SettingsItem[] = [
  {
    name: "General",
    href: "/settings",
  },
  {
    name: "Billing",
    href: "/settings/billing",
  },
];

export const SettingsNavigation = () => {
  const [isLarger] = useMediaQuery("(min-width: 768px)", {
    ssr: false,
  });
  if (isLarger) {
    return (
      <Flex direction="column" gap="3">
        {items.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </Flex>
    );
  }
  return <MobileNavigation />;
};

const NavItem = ({ item }: { item: SettingsItem }) => {
  const { name, href } = item;
  const router = useRouter();
  const selected = router.pathname == href;
  return (
    <Link href={href} passHref={true}>
      <ChakraLink
        fontWeight="medium"
        color={selected ? "rgb(102, 184, 255)" : undefined}
        _hover={{ textDecorationLine: "none" }}
      >
        {name}
      </ChakraLink>
    </Link>
  );
};

const MobileNavigation = () => {
  const router = useRouter();
  return (
    <Select mb="5">
      {items.map((option) => (
        <option
          key={option.name}
          value={option.name}
          selected={option.href === router.pathname}
          onClick={() => router.push(option.href)}
        >
          {option.name}
        </option>
      ))}
    </Select>
  );
};
