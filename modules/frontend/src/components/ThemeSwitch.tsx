import { Flex, FlexProps, Switch, Text, useColorMode } from "@chakra-ui/react";
import React from "react";

type ThemeSwitchProps = FlexProps;

const ThemeSwitch = (props: ThemeSwitchProps): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex alignItems="center" {...props}>
      <Text as="span" fontSize="lg" mr="2">
        {colorMode === "light" ? "Tulkoon yö!" : "Tulkoon valo!"}
      </Text>
      <Switch
        onChange={toggleColorMode}
        isChecked={colorMode === "dark"}
        size="lg"
        color="primary.regular"
      />
    </Flex>
  );
};

export default ThemeSwitch;
