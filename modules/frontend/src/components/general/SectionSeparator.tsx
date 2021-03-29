import { Box } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";

type SectionSeparatorProps = {
  title: string;
};

const SectionSeparator = ({ title }: SectionSeparatorProps): JSX.Element => {
  return (
    <Box pb="4" borderBottom="2px solid" borderColor="secondary.regular" my="5">
      <Heading.H2 textAlign="center" mb="0">
        {title}
      </Heading.H2>
    </Box>
  );
};

export default SectionSeparator;
