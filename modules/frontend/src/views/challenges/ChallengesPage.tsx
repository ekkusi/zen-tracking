import React, { useEffect, useState, useRef } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import { useQuery } from "@apollo/client";
import useGlobal from "store";
import { ChallengeStatus } from "__generated__/globalTypes";
import EditChallenge from "components/EditChallenge";
import ChallengeSelect, {
  OptionType,
  SelectHandle,
} from "components/ChallengeSelect";
import { Link } from "react-router-dom";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { GET_CHALLENGES } from "./queries";
import {
  GetChallengesQuery,
  GetChallengesQuery_getChallenges,
} from "./__generated__/GetChallengesQuery";
import ChallengesSeparator from "./ChallengesSeparator";
import ChallengesSection from "./ChallengesSection";

const ChallengesPage = (): JSX.Element => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const selectRef = useRef<SelectHandle>(null);

  const user = useGlobal((state) => state.currentUser)[0];
  const [activeParticipation, updateActiveParticipation] = useGlobal(
    (store) => store.activeParticipation,
    (actions) => actions.updateActiveParticipation
  );

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

  const { data, error: apolloError, refetch } = useQuery<GetChallengesQuery>(
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
      // Challenges that current user is participating in, but not the creator
      const newUserParticipationChallenges = data.getChallenges.filter(
        (it) =>
          !!it.participations.find(
            (participation) =>
              participation.user.name === user.name &&
              it.creator.name !== user.name
          )
      );
      // Other challenges
      const newOtherChallenges = data.getChallenges.filter(
        (it) =>
          it.creator.name !== user.name &&
          !it.participations.find(
            (participation) => participation.user.name === user.name
          )
      );
      setChallengesByUser(newChallengesByUser);
      setUserParticipationChallenges(newUserParticipationChallenges);
      setOtherChallenges(newOtherChallenges);
    }
  }, [data, user]);

  const refetchChallenges = async () => {
    await refetch();
    if (selectRef?.current) {
      selectRef.current.refetchOptions();
    }
  };

  const onActiveChallengeSelect = async (value: OptionType | null) => {
    setLoading(true);
    await updateActiveParticipation(value?.value ?? null);
    setLoading(false);
  };

  return (
    <Box pb="5">
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
          onEdit={refetchChallenges}
          openButtonProps={{ size: "lg" }}
        />
      </Flex>
      {data && (
        <Box>
          <ChallengesSeparator title="Omat haasteet" />
          <Flex
            direction="column"
            alignItems={{ base: "left", sm: "center" }}
            mb="6"
          >
            <Heading.H3 fontWeight="normal" mb="2">
              Valitse aktiivinen haaste
            </Heading.H3>
            <ChallengeSelect
              initialValue={
                activeParticipation
                  ? {
                      value: activeParticipation.challenge.id,
                      label: activeParticipation.challenge.name,
                    }
                  : undefined
              }
              onSelect={onActiveChallengeSelect}
              isLoading={loading}
              containerProps={{ mb: "2" }}
              ref={selectRef}
            />
            <Text as={Link} to="/" fontWeight="bold" fontSize="lg">
              Siirry merkkaamaan
              <ArrowForwardIcon />
            </Text>
          </Flex>

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
