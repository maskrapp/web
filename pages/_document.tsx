import { ColorModeScript } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html dir="ltr">
      <Head />
      <body style={{ backgroundColor: "#232530" }}>
        <ColorModeScript initialColorMode="dark" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
