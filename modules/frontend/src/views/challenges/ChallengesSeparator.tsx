import { Box } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";

type ChallengesSeparatorProps = {
  title: string;
};

const ChallengesSeparator = ({
  title,
}: ChallengesSeparatorProps): JSX.Element => {
  return (
    <Box pb="4" borderBottom="2px solid" borderColor="secondary.regular" my="5">
      <Heading.H2 textAlign="center" mb="0">
        {title}
      </Heading.H2>
    </Box>
  );
};

export default ChallengesSeparator;
