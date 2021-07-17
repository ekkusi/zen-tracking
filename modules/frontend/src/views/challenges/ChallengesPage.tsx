import React, { useState, useMemo } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import { useQuery } from "@apollo/client";
import { ChallengeStatus } from "__generated__/globalTypes";
import EditChallenge from "components/functional/EditChallenge";
import { Link, useHistory } from "react-router-dom";
import ChallengesSection from "./ChallengesSection";
import Loading from "../../components/general/Loading";
import { GET_CHALLENGES } from "../../generalQueries";
import {
  GetChallenges,
  GetChallengesVariables,
} from "../../__generated__/GetChallenges";

const ChallengesPage = (): JSX.Element => {
  const [skip, setSkip] = useState(false);

  const history = useHistory();

  const {
    data: suggestionChallengesData,
    loading: suggestionChallengesLoading,
    error: suggestionChallengesError,
    refetch: suggestionChallengesreFetch,
  } = useQuery<GetChallenges, GetChallengesVariables>(
    GET_CHALLENGES,
    {
      variables: {
        filters: {
          status: ChallengeStatus.SUGGESTION,
        },
      },
      skip,
      fetchPolicy: "network-only",
    } // This stops looping useQuery when error is returned
  );

  const {
    data: upcomingChallengesData,
    loading: upcomingChallengesLoading,
    error: upcomingChallengesError,
    refetch: upcomingChallengesreFetch,
  } = useQuery<GetChallenges, GetChallengesVariables>(
    GET_CHALLENGES,
    {
      variables: {
        filters: {
          status: ChallengeStatus.UPCOMING,
        },
      },
      skip,
      fetchPolicy: "network-only",
    } // This stops looping useQuery when error is returned
  );

  const {
    data: activeChallengesData,
    loading: activeChallengesLoading,
    error: activeChallengesError,
    refetch: activeChallengereFetch,
  } = useQuery<GetChallenges, GetChallengesVariables>(
    GET_CHALLENGES,
    {
      variables: {
        filters: {
          status: ChallengeStatus.ACTIVE,
        },
      },
      skip,
      fetchPolicy: "network-only",
    } // This stops looping useQuery when error is returned
  );

  const {
    data: pastChallengesData,
    loading: pastChallengesLoading,
    error: pastChallengesError,
    refetch: pastChallengesreFetch,
  } = useQuery<GetChallenges, GetChallengesVariables>(
    GET_CHALLENGES,
    {
      variables: {
        filters: {
          status: ChallengeStatus.ENDED,
        },
      },
      skip,
      fetchPolicy: "network-only",
    } // This stops looping useQuery when error is returned
  );

  const error = useMemo((): string | undefined => {
    if (
      suggestionChallengesError ||
      upcomingChallengesError ||
      activeChallengesError ||
      pastChallengesError
    ) {
      return [
        suggestionChallengesError?.message,
        upcomingChallengesError?.message,
        activeChallengesError?.message,
        pastChallengesError?.message,
      ].join(",");
    }
    return undefined;
  }, [
    suggestionChallengesError,
    upcomingChallengesError,
    activeChallengesError,
    pastChallengesError,
  ]);

  const loading = useMemo(() => {
    return (
      suggestionChallengesLoading ||
      upcomingChallengesLoading ||
      activeChallengesLoading ||
      pastChallengesLoading
    );
  }, [
    suggestionChallengesLoading,
    upcomingChallengesLoading,
    activeChallengesLoading,
    pastChallengesLoading,
  ]);

  if (error) {
    setSkip(true);
  }

  const refetchChallenges = () => {
    suggestionChallengesreFetch();
    upcomingChallengesreFetch();
    activeChallengereFetch();
    pastChallengesreFetch();
  };

  return (
    <Box pb="5" position="relative">
      <Text as={Link} to="/" display={{ base: "none", sm: "inline-block" }}>
        Takaisin etusivulle
      </Text>
      <Heading.H1
        textAlign={{ base: "left", sm: "center" }}
        fontSize={{ base: "4xl", sm: "5xl" }}
        fontWeight="normal"
      >
        Haasteet
      </Heading.H1>
      <Text>
        Tällä sivulla löytyy tulevat ja menevät haasteet. Alta voit luoda oman
        haasteen halutessasi.
      </Text>
      <Flex justifyContent={{ base: "left", sm: "center" }}>
        <EditChallenge
          onEdit={async (challenge) => {
            await refetchChallenges();
            history.push(`/challenges/${challenge.id}`);
          }}
          openButtonProps={{ size: "lg" }}
        />
      </Flex>
      {!loading && !error && (
        <Box>
          <ChallengesSection
            title="Aktiiviset haasteet"
            challenges={activeChallengesData?.getChallenges || []}
          />
          <ChallengesSection
            title="Tulevat haasteet"
            challenges={upcomingChallengesData?.getChallenges || []}
          />
          <ChallengesSection
            title="Ehdotukset"
            challenges={suggestionChallengesData?.getChallenges || []}
          />
          <ChallengesSection
            title="Menneet haasteet"
            challenges={pastChallengesData?.getChallenges || []}
          />
        </Box>
      )}
      {loading && <Loading />}
      {error && (
        <Text fontWeight="bold" color="warning">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default ChallengesPage;
