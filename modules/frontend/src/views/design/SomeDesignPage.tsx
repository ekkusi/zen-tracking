import { gql, useQuery } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";
import { ChallengeStatus } from "__generated__/globalTypes";

const SomeDesignPage = (): JSX.Element => {
  const getChallengesQuery = gql`
    query GetChallengesTestQuery($filters: ChallengeFilters!) {
      getChallenges(filters: $filters) {
        name
      }
    }
  `;

  const { data, loading } = useQuery(getChallengesQuery, {
    variables: {
      filters: {
        status: ChallengeStatus.ACTIVE,
      },
    },
  });

  const challenges = data?.getChallenges;

  return (
    <Box p="7">
      <Heading.H1 textAlign="center">Ekun hieno Apollo demo</Heading.H1>
      <Heading.H2>Haasteiden nimet tähän!</Heading.H2>
      {loading && <Text>Loading</Text>}
      {challenges &&
        challenges.map((it: any) => <Text key={it.name}>{it.name}</Text>)}
    </Box>
  );
};

export default SomeDesignPage;
