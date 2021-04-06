import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { differenceInCalendarDays } from "date-fns/esm";
import { IoLeaf } from "react-icons/io5";
import Heading from "../../../components/primitives/Heading";
import Loading from "../../../components/general/Loading";
import {
  GetWholeParticipation,
  GetWholeParticipationVariables,
} from "./__generated__/GetWholeParticipation";
import { GET_WHOLE_PARTICIPATION } from "./queries";
import useGlobal from "../../../store";
import Progress from "../../../components/general/Progress";
import {
  getChallengeDateString,
  getChallengeLength,
} from "../../../util/challengeUtils";

const ParticipationPage = (): JSX.Element => {
  const { challengeId, userName } = useParams<{
    challengeId: string;
    userName: string;
  }>();
  const history = useHistory<{ isRecap?: boolean }>();
  const isRecap = history.location.state?.isRecap ?? false;

  const user = useGlobal((state) => state.currentUser)[0];

  const { data, loading, error } = useQuery<
    GetWholeParticipation,
    GetWholeParticipationVariables
  >(GET_WHOLE_PARTICIPATION, {
    variables: {
      challengeId,
      userName,
    },
  });

  const participation = data?.getParticipation;

  const currentProgressDayValue = useMemo(() => {
    if (participation && participation.challenge.startDate) {
      const currentDate = new Date();
      return differenceInCalendarDays(
        currentDate,
        new Date(participation.challenge.startDate)
      );
    }
    return 0;
  }, [participation]);

  const daysRemaining = useMemo(() => {
    if (participation) {
      const differenceFromLength =
        getChallengeLength(participation.challenge) - currentProgressDayValue;
      return differenceFromLength > 0 ? differenceFromLength : 0;
    }
    return 0;
  }, [participation, currentProgressDayValue]);

  const markingsMean = useMemo(() => {
    if (participation && participation.markings.length > 0) {
      let sum = 0;
      participation.markings.forEach((it) => {
        sum += it.rating;
      });
      return sum !== 0 ? sum / participation.markings.length : 0;
    }
    return "Ei merkkauksia";
  }, [participation]);

  return (
    <Box>
      <Link to="/">Takaisin etusivulle</Link>
      {participation && (
        <>
          <Heading.H1>{participation.challenge.name}</Heading.H1>
          {!isRecap && (
            <Flex
              border="1px solid"
              borderColor="gray.300"
              borderRadius="5px"
              p="3"
              justifyContent="space-between"
              mb="4"
            >
              <Text as="span">
                Suorittaja:{" "}
                <b>
                  {user.name === participation.user.name
                    ? "Sinä"
                    : participation.user.name}
                </b>{" "}
              </Text>
              <Text as="span">
                Aika: <b>{getChallengeDateString(participation.challenge)}</b>{" "}
              </Text>
            </Flex>
          )}
          <Flex direction="row" wrap="nowrap">
            <Box width="100%" textAlign="center">
              <Progress
                borderRadius="5px"
                colorScheme="green"
                max={getChallengeLength(participation.challenge)}
                value={currentProgressDayValue}
              />
              <Text as="span" fontSize="xl">
                {daysRemaining > 0
                  ? `Päiviä jäljellä: ${daysRemaining}`
                  : "Suoritettu!"}
              </Text>
            </Box>
            <Box width="100%" textAlign="center">
              <Box>
                {[0, 1, 2, 3, 4].map((it) => (
                  <Icon key={it} as={IoLeaf} color="green.600" w={10} h={10} />
                ))}
              </Box>
              <Text as="span" fontSize="lg">
                Keskiarvo: {markingsMean}
              </Text>
            </Box>
          </Flex>
        </>
      )}
      {loading && <Loading />}
      {error && <Text color="warning">{error.message}</Text>}
    </Box>
  );
};

export default ParticipationPage;
