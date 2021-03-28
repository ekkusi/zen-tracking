import { Box } from "@chakra-ui/react";
import React from "react";
import Heading from "../../components/primitives/Heading";

const ProfilePage = (): JSX.Element => {
  return (
    <Box>
      <Heading.H1>
        Tähän tulloo yhen ukkelin ilmottautuminen ja muut tiedot
      </Heading.H1>
    </Box>
  );
};

export default ProfilePage;
