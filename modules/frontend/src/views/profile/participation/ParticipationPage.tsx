import {
  Box,
  Flex,
  ListItem,
  Text,
  UnorderedList,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { differenceInCalendarDays } from "date-fns/esm";
import { MotionProps, Target } from "framer-motion";
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
import LeafRating from "../../../components/general/LeafRating";
import chakraMotionWrapper from "../../../util/chakraMotionWrapper";
import theme from "../../../theme";
import MarkingCalendar from "../../../components/functional/MarkingCalendar";
import MarkingCard from "../../../components/functional/MarkingCard";

const BoxWithMotion = chakraMotionWrapper(Box);
const TextWithMotion = chakraMotionWrapper(Text);
const FlexWithMotion = chakraMotionWrapper(Flex);

const ParticipationPage = (): JSX.Element => {
  const { challengeId, userName } = useParams<{
    challengeId: string;
    userName: string;
  }>();
  const history = useHistory<{ isRecap?: boolean }>();
  const isRecap = history.location.state?.isRecap ?? false;

  const isSmScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)[0];

  const user = useGlobal((state) => state.currentUser)[0];
  const hideNavigation = useGlobal((state) => state.hideNavigation)[0];

  const { data, loading, error, refetch } = useQuery<
    GetWholeParticipation,
    GetWholeParticipationVariables
  >(GET_WHOLE_PARTICIPATION, {
    variables: {
      challengeId,
      userName,
    },
  });

  const participation = data?.getParticipation;

  const sortedMarkings = useMemo(() => {
    if (participation) {
      const newMarkings = [...participation.markings];
      newMarkings.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      return newMarkings;
    }
    return [];
  }, [participation]);

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
      return sum !== 0
        ? Math.round((sum / participation.markings.length) * 100) / 100
        : 0;
    }
    return 0;
  }, [participation]);

  const otherThanCurrentUserParticipations = useMemo(() => {
    if (participation) {
      return participation.challenge.participations.filter(
        (it) => it.user.name !== user.name
      );
    }
    return [];
  }, [participation, user.name]);

  const formatOpacityAnimationProps = (delay: number, duration = 1) => {
    return {
      initial: {
        opacity: isRecap ? 0 : 1, // Don't animate, if not recap
      },
      animate: {
        opacity: 1,
      },
      transition: {
        delay,
        duration,
      },
    };
  };

  const formatAnimationProps = (
    animateStartProps: Target,
    animateEndProps: Target,
    duration: number,
    delay: number
  ): MotionProps => {
    let startPropsNew: Target;
    // Don't animate if is not recap
    if (!isRecap) {
      startPropsNew = animateEndProps;
    } else {
      startPropsNew = animateStartProps;
    }
    return {
      initial: startPropsNew,
      animate: animateEndProps,
      transition: {
        delay,
        duration,
      },
    };
  };

  return (
    <Box>
      {!loading && !isRecap && (
        <Flex justify="space-between">
          <Link to="/">Takaisin etusivulle</Link>

          {participation && (
            <Text as="span">
              Suorittaja:{" "}
              <b>
                {user.name === participation?.user.name
                  ? "Sinä"
                  : participation.user.name}
              </b>{" "}
            </Text>
          )}
        </Flex>
      )}
      {participation && (
        <>
          <BoxWithMotion
            {...formatOpacityAnimationProps(0)}
            mb="5"
            textAlign="center"
          >
            <Heading.H1 mt={hideNavigation ? 5 : 0} mb="0">
              {participation.challenge.name}
            </Heading.H1>
            <Text as="span" fontSize="2xl">
              {getChallengeDateString(participation.challenge)}
            </Text>
          </BoxWithMotion>
          <Flex
            direction={{ base: "column", sm: "row" }}
            wrap="nowrap"
            justify={{ base: "start", sm: "space-between" }}
            mb="5"
          >
            <BoxWithMotion
              width={{ base: "100%", sm: "50%" }}
              {...formatAnimationProps(
                {
                  x: isSmScreen ? 0 : "50%",
                  y: isSmScreen ? "100px" : "300px",
                  scale: isSmScreen ? 1.1 : 1.5,
                },
                {
                  x: 0,
                  y: 0,
                  scale: 1.0,
                },
                1,
                5
              )}
              mb={{ base: "2", sm: "0" }}
            >
              <BoxWithMotion
                {...formatOpacityAnimationProps(1)}
                textAlign="center"
              >
                <Progress
                  height={{ base: "2.5em", sm: "3em" }}
                  value={currentProgressDayValue}
                  max={getChallengeLength(participation.challenge)}
                  transition={{
                    ease: "easeInOut",
                    duration: 1.5,
                    delay: 2,
                  }}
                  isAnimated={isRecap}
                />
                <TextWithMotion
                  as="span"
                  fontSize={{ base: "xl", sm: "2xl" }}
                  textAlign="center"
                  {...formatOpacityAnimationProps(3.5)}
                >
                  Päiviä jäljellä: {daysRemaining}
                  {daysRemaining === 0 && " - Suoritettu!"}
                </TextWithMotion>
              </BoxWithMotion>
            </BoxWithMotion>
            <FlexWithMotion
              justifyContent="center"
              textAlign="center"
              width={{ base: "100%", sm: "50%" }}
              {...formatAnimationProps(
                {
                  x: isSmScreen ? 0 : "-50%",
                  y: isSmScreen ? "50px" : "300px",
                  scale: isSmScreen ? 1.1 : 1.5,
                },
                {
                  x: 0,
                  y: 0,
                  scale: 1.0,
                },
                1,
                10
              )}
            >
              <BoxWithMotion {...formatOpacityAnimationProps(6)}>
                <LeafRating
                  baseId="mean-leaf-rating"
                  value={markingsMean}
                  isAnimated={isRecap}
                  initialDelay={7}
                  iconSize="3em"
                  animationDuration={2}
                />

                <TextWithMotion
                  as="span"
                  fontSize={{ base: "xl", sm: "2xl" }}
                  {...formatOpacityAnimationProps(9)}
                >
                  Fiilisten keskiarvo: {markingsMean}
                </TextWithMotion>
              </BoxWithMotion>
            </FlexWithMotion>
          </Flex>
          <BoxWithMotion {...formatOpacityAnimationProps(11)} mb="20">
            <Heading.H2 textAlign="center">Merkkaukset</Heading.H2>
            <MarkingCalendar
              participation={participation}
              onEdit={() => refetch()}
              isEditable={participation.user.name === user.name}
            />
          </BoxWithMotion>
          <Flex
            wrap="wrap"
            justify={{ base: "start", sm: "space-around", lg: "space-between" }}
          >
            {sortedMarkings.map((it, index) => (
              <BoxWithMotion
                flex={{ base: 1, sm: 0 }}
                key={it.id}
                {...formatOpacityAnimationProps(12 + index * 0.3)}
                mr={{ base: 0, sm: 2 }}
                mb="4"
              >
                <MarkingCard marking={it} />
              </BoxWithMotion>
            ))}
          </Flex>
          {!isRecap && otherThanCurrentUserParticipations.length > 0 && (
            <>
              <Heading.H2>Katso muiden suorituksia</Heading.H2>
              <UnorderedList>
                {otherThanCurrentUserParticipations.map((it) => (
                  <ListItem key={it.id}>
                    <Link
                      to={`/profile/${it.user.name}/${participation.challenge.id}`}
                    >
                      {it.user.name}
                    </Link>
                  </ListItem>
                ))}
              </UnorderedList>
            </>
          )}
        </>
      )}
      {loading && <Loading />}
      {error && <Text color="warning">{error.message}</Text>}
    </Box>
  );
};

export default ParticipationPage;
