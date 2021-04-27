import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";

type SectionSeparatorProps = BoxProps & {
  title: string;
};

const SectionSeparator = ({
  title,
  ...boxProps
}: SectionSeparatorProps): JSX.Element => {
  const { colorMode } = useColorMode();
  return (
    <Box
      pb="4"
      borderBottom="2px solid"
      borderColor={colorMode === "light" ? "gray.700" : "white"}
      mb="5"
      mt="20"
      {...boxProps}
    >
      <Heading.H2 textAlign="center" mb="0">
        {title}
      </Heading.H2>
    </Box>
  );
};

export default SectionSeparator;
