import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import Heading from "../../../components/primitives/Heading";

const ParticipationPage = (): JSX.Element => {
  return (
    <Box>
      <Heading.H1>Suorituksen seuraaminen</Heading.H1>
      <Text>
        Tähän tulloo sivu haasteen osallistumisen kokonaisuuden
        tarkastelemiseen. Malta vielä tovi, sivu on kovan työn alla:)
      </Text>
      <Link to="/">Takaisin etusivulle</Link>
    </Box>
  );
};

export default ParticipationPage;
