import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CHALLENGES } from "./queries";
import { GetChallengesQuery } from "./__generated__/GetChallengesQuery";

const ChallengesPage = (): JSX.Element => {
  const { data, loading, error } = useQuery<GetChallengesQuery>(GET_CHALLENGES);
  return (
    <Box>
      <Link to="/">Takaisin pääsivulle</Link>
      <Heading.H1>Haasteet</Heading.H1>
      <Text>
        Tällä sivulla löytyy tulevat ja menevät haasteet. Alta voit luoda oman
        haasteen halutessasi.
      </Text>
      {data && (
        <Box>
          <Heading.H2>Kaikki haasteet:</Heading.H2>
          {data.getChallenges.map((it) => (
            <Box key={it.id}>
              <Heading.H3>{it.name}</Heading.H3>
            </Box>
          ))}
        </Box>
      )}
      {loading && (
        <Spinner mb="4" color="primary.regular" size="xl" thickness="3px" />
      )}
      {error && (
        <Text color="warning">
          Jotain meni vikaan haasteiden lataamisessa: {error}
        </Text>
      )}
    </Box>
  );
};

export default ChallengesPage;
