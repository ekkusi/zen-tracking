import { Box, useColorMode } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";

type SectionSeparatorProps = {
  title: string;
};

const SectionSeparator = ({ title }: SectionSeparatorProps): JSX.Element => {
  const { colorMode } = useColorMode();
  return (
    <Box
      pb="4"
      borderBottom="2px solid"
      borderColor={colorMode === "light" ? "gray.700" : "white"}
      mb="5"
      mt="20"
    >
      <Heading.H2 textAlign="center" mb="0">
        {title}
      </Heading.H2>
    </Box>
  );
};

export default SectionSeparator;
