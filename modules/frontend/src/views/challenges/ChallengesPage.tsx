import React, { useCallback, useEffect, useState } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import { useQuery } from "@apollo/client";
import useGlobal from "store";
import { GET_CHALLENGES } from "./queries";
import {
  GetChallengesQuery,
  GetChallengesQuery_getChallenges,
} from "./__generated__/GetChallengesQuery";
import ChallengesSeparator from "./ChallengesSeparator";
import ChallengeCard from "./ChallengeCard";

const ChallengesPage = (): JSX.Element => {
  const [error, setError] = useState<string>();
  const [userChallenges, setUserChallenges] = useState<
    GetChallengesQuery_getChallenges[]
  >([]);
  const [otherChallenges, setOtherChallenges] = useState<
    GetChallengesQuery_getChallenges[]
  >([]);
  const user = useGlobal((state) => state.currentUser)[0];
  const { data, loading, error: apolloError } = useQuery<GetChallengesQuery>(
    GET_CHALLENGES,
    { skip: !!error }
  );

  if (apolloError) {
    console.log(apolloError);

    setError(
      `Jotakin meni vikaan haasteiden hakemisessa: ${apolloError.message}`
    );
  }

  useEffect(() => {
    if (data) {
      console.log("setting challenges");
      const newUserChallenges = data.getChallenges.filter(
        (it) => it.creator.name === user.name
      );
      const newOtherChallenges = data.getChallenges.filter(
        (it) => it.creator.name !== user.name
      );
      setUserChallenges(newUserChallenges);
      setOtherChallenges(newOtherChallenges);
    }
  }, [data, user]);

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
      {data && (
        <Box>
          <ChallengesSeparator title="Omat haasteet" />
          {userChallenges.length > 0 ? (
            <Flex wrap="wrap">
              {userChallenges.map((it) => (
                <ChallengeCard key={it.id} challenge={it} mr="2" mb="2" />
              ))}
            </Flex>
          ) : (
            <Text>Sinulla ei vielä ole haasteita</Text>
          )}
          <ChallengesSeparator title="Muut haasteet" />
          {otherChallenges.length > 0 ? (
            <Flex wrap="wrap">
              {otherChallenges.map((it) => (
                <ChallengeCard key={it.id} challenge={it} mr="2" mb="2" />
              ))}
            </Flex>
          ) : (
            <Text>Ei haasteita</Text>
          )}
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
