import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import { useApolloClient, useQuery } from "@apollo/client";
import useGlobal from "store";
import { ChallengeStatus } from "__generated__/globalTypes";
import EditChallenge from "components/EditChallenge";
import { GET_CHALLENGES } from "./queries";
import {
  GetChallengesQuery,
  GetChallengesQuery_getChallenges,
} from "./__generated__/GetChallengesQuery";
import ChallengesSeparator from "./ChallengesSeparator";
import ChallengesSection from "./ChallengesSection";

const ChallengesPage = (): JSX.Element => {
  const [error, setError] = useState<string>();
  const user = useGlobal((state) => state.currentUser)[0];
  const updateActiveParticipation = useGlobal(
    (state) => state.currentUser,
    (actions) => actions.updateActiveParticipation
  )[1];

  const [challengesByUser, setChallengesByUser] = useState<
    GetChallengesQuery_getChallenges[]
  >([]);
  const [
    userParticipationChallenges,
    setUserParticipationChallenges,
  ] = useState<GetChallengesQuery_getChallenges[]>([]);
  const [otherChallenges, setOtherChallenges] = useState<
    GetChallengesQuery_getChallenges[]
  >([]);

  const {
    data,
    loading,
    error: apolloError,
    refetch,
  } = useQuery<GetChallengesQuery>(
    GET_CHALLENGES,
    { skip: !!error, fetchPolicy: "no-cache" } // This stops looping useQuery when error is returned
  );

  if (apolloError) {
    setError(
      `Jotakin meni vikaan haasteiden hakemisessa: ${apolloError.message}`
    );
  }

  // Return challenges that match status filter and are not already in user challenges
  const getOtherChallenges = (status: ChallengeStatus) => {
    return otherChallenges.filter(
      (it) =>
        it.status === status &&
        !challengesByUser.find((challenge) => challenge.id === it.id)
    );
  };

  useEffect(() => {
    if (data) {
      // TODO: This filtering should probably go to backend and put here as separate lazyQueries
      // Challenges that are created by current user
      const newChallengesByUser = data.getChallenges.filter(
        (it) => it.creator.name === user.name
      );
      // Challenges that current user is participating in, but not the user
      const newUserParticipationChallenges = data.getChallenges.filter(
        (it) =>
          !!it.participations.find(
            (participation) => participation.user.name === user.name
          )
      );
      // Other challenges
      const newOtherChallenges = data.getChallenges.filter(
        (it) =>
          it.creator.name !== user.name &&
          !it.participations.find(
            (participation) =>
              participation.user.name === user.name &&
              it.creator.name !== user.name
          )
      );
      setChallengesByUser(newChallengesByUser);
      setUserParticipationChallenges(newUserParticipationChallenges);
      setOtherChallenges(newOtherChallenges);
    }
  }, [data, user]);

  const refetchChallenges = async () => {
    await refetch();
    await updateActiveParticipation();
  };

  return (
    <Box>
      {/* <ButtonWithRef as={Link} leftIcon={<ArrowBackIcon />} to="/" mb="3">
        Takaisin etusivulle
      </ButtonWithRef> */}
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
        <EditChallenge onEdit={refetchChallenges} />
      </Flex>
      {data && (
        <Box>
          <ChallengesSeparator title="Omat haasteet" />
          <ChallengesSection
            title="Luomasi haasteet"
            challenges={challengesByUser}
            updateChallenges={refetchChallenges}
          />
          <ChallengesSection
            title="Ilmoittautumisesi"
            challenges={userParticipationChallenges}
            updateChallenges={refetchChallenges}
          />
          <ChallengesSeparator title="Muut haasteet" />
          <ChallengesSection
            title="Ehdotukset"
            challenges={getOtherChallenges(ChallengeStatus.SUGGESTION)}
            updateChallenges={refetchChallenges}
          />
          <ChallengesSection
            title="Aktiiviset haasteet"
            challenges={getOtherChallenges(ChallengeStatus.ACTIVE)}
            updateChallenges={refetchChallenges}
          />
          <ChallengesSection
            title="Tulevat haasteet"
            challenges={getOtherChallenges(ChallengeStatus.UPCOMING)}
            updateChallenges={refetchChallenges}
          />
          <ChallengesSection
            title="Menneet haasteet"
            challenges={getOtherChallenges(ChallengeStatus.ENDED)}
            updateChallenges={refetchChallenges}
          />
        </Box>
      )}
      {loading && (
        <Flex alignItems="center" justifyContent="center" pt="4">
          <Text as="span" color="primary.regular" mr="3">
            Ladataan haasteita
          </Text>
          <Spinner color="primary.regular" size="xl" thickness="3px" />
        </Flex>
      )}
      {error && (
        <Text fontWeight="bold" color="warning">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default ChallengesPage;
