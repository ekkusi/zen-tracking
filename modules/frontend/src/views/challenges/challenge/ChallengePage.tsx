import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  ListItem,
  OrderedList,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";

import { Link, useHistory, useParams } from "react-router-dom";
import Heading from "../../../components/primitives/Heading";
import useGlobal from "../../../store";
import { CREATE_PARTICIPATION, DELETE_PARTICIPATION } from "../queries";
import {
  CreateParticipation,
  CreateParticipationVariables,
} from "../__generated__/CreateParticipation";
import {
  DeteleParticipation,
  DeteleParticipationVariables,
} from "../__generated__/DeteleParticipation";
import {
  GetChallenge,
  GetChallengeVariables,
} from "./__generated__/GetChallenge";
import { GET_CHALLENGE } from "./queries";
import Loading from "../../../components/general/Loading";
import EditChallenge from "../../../components/EditChallenge";
import DeleteConfimationModal from "../../../components/DeleteConfirmationModal";
import { PrimaryButton } from "../../../components/primitives/Button";
import DateUtil from "../../../util/DateUtil";
import chakraMotionWrapper from "../../../util/chakraMotionWrapper";
import theme from "../../../theme";

const FlexWithMotion = chakraMotionWrapper(Flex);

const ChallengePage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const [bottomBarState, setBottomBarState] = useState<"hidden" | "visible">(
    "visible"
  );

  const user = useGlobal((state) => state.currentUser)[0];
  const [activeParticipation, updateActiveParticipation] = useGlobal(
    (state) => state.activeParticipation,
    (actions) => actions.updateActiveParticipation
  );

  const history = useHistory();
  const [isMobile] = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { data, loading, error, refetch } = useQuery<
    GetChallenge,
    GetChallengeVariables
  >(GET_CHALLENGE, {
    variables: {
      id,
    },
    fetchPolicy: "network-only",
  });

  let lastScrollTop = window.pageYOffset;

  const onScroll = () => {
    const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (st > lastScrollTop) {
      if (bottomBarState === "visible") {
        setBottomBarState("hidden");
      }
    } else if (bottomBarState === "hidden") setBottomBarState("visible");
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  };

  useEffect(() => {
    if (isMobile) {
      console.log("Adding event listener");
      window.addEventListener("scroll", onScroll);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  const [addParticipation, { loading: addLoading }] = useMutation<
    CreateParticipation,
    CreateParticipationVariables
  >(CREATE_PARTICIPATION, {
    variables: {
      challengeId: id,
    },
  });

  const [deleteParticipation] = useMutation<
    DeteleParticipation,
    DeteleParticipationVariables
  >(DELETE_PARTICIPATION, {
    variables: {
      challengeId: id,
    },
  });

  const challenge = useMemo(() => {
    return data?.getChallenge;
  }, [data]);

  const dateString = useMemo(() => {
    if (challenge?.startDate && challenge?.endDate) {
      return `${DateUtil.format(challenge.startDate)} - ${DateUtil.format(
        challenge.endDate
      )}`;
    }
    return "Ei määritelty";
  }, [challenge]);

  const removeParticipation = async () => {
    try {
      await deleteParticipation();
      refetch();
      // await updateChallenges();
      // If deletedParticipation was the activeParticipation, update activeParticipation
      if (activeParticipation && activeParticipation.challenge.id === id) {
        updateActiveParticipation(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const createParticipation = async () => {
    try {
      const result = await addParticipation();
      refetch();
      // await onEdit();
      // If activeparticipation isn't updated by updateChallenges -> update manually with created challenge
      if (!activeParticipation && result.data) {
        updateActiveParticipation(result.data.createParticipation);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserParticipation = () => {
    const participation = challenge?.participations.find(
      (it) => it.user.name === user.name
    );
    return participation;
  };

  const isUserChallengeCreator = () => {
    return challenge?.creator.name === user.name;
  };

  const bottomBarVariants = {
    hidden: { bottom: -100 },
    visible: { bottom: 0 },
  };

  return (
    <Box>
      <Text
        as={Link}
        display="inline-block"
        to="/challenges"
        fontSize="lg"
        mb="3"
      >
        Takaisin haasteisiin
      </Text>
      {loading && <Loading />}
      {challenge && (
        <>
          <Heading.H1 textAlign={{ base: "left", sm: "center" }}>
            {challenge.name}
          </Heading.H1>
          <Grid
            mb="5"
            templateColumns={{
              base: "1fr",
              sm: "repeat(3, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap="2"
          >
            <GridItem as="span">
              Aika:{" "}
              <Text as="span" fontWeight="bold" fontStyle="italic">
                {dateString}{" "}
              </Text>
            </GridItem>
            <GridItem as="span">
              Tekijä:{" "}
              <Text as="span" fontWeight="bold" fontStyle="italic">
                {challenge.creator.name}
              </Text>
            </GridItem>
            <GridItem as="span">
              Ilmoittautuneita:{" "}
              <Text as="span" fontWeight="bold" fontStyle="italic">
                {challenge.participations.length}
              </Text>
            </GridItem>
          </Grid>
          <Heading.H2>Kuvaus</Heading.H2>
          <Text mb="5">{challenge.description}</Text>
          <Heading.H2>Ilmoittautuneet</Heading.H2>
          {challenge.participations.length > 0 ? (
            <OrderedList>
              {challenge.participations.map((it) => (
                <ListItem key={it.id}>{it.user.name}</ListItem>
              ))}
            </OrderedList>
          ) : (
            <Text>
              Haasteessa ei vielä ole ilmottautumisia. Ole ensimmäinen ja
              ilmoittaudu alta!
            </Text>
          )}

          <FlexWithMotion
            width="100%"
            boxShadow="-5px 0 10px -5px black"
            position="fixed"
            left="0"
            justify="flex-start"
            alignItems="start"
            pb="3"
            pt="3"
            px="3"
            zIndex="100"
            bg="white"
            initial="hidden"
            animate={bottomBarState}
            variants={bottomBarVariants}
          >
            {isUserChallengeCreator() && (
              <EditChallenge
                challenge={challenge}
                onEdit={() => {
                  console.log("Refetching");

                  refetch();
                }}
                onDelete={() => history.push("/challenges")}
                openButtonLabel="Muokkaa"
                openButtonProps={{
                  size: "xs",
                  mr: { base: "4", sm: "4" },
                }}
              />
            )}
            {getUserParticipation() ? (
              <>
                <DeleteConfimationModal
                  onDelete={removeParticipation}
                  openButtonLabel="Poista ilmoittautuminen"
                  headerLabel="Poista ilmoittautuminen"
                >
                  <Text>
                    Oletko varma, että haluat poistaa ilmoittautumisesi
                    haasteesta {challenge.name}? Jos sinulla on merkkauksia
                    kyseiseen haasteeseen, poistuvat nekin.
                  </Text>
                </DeleteConfimationModal>
              </>
            ) : (
              <PrimaryButton
                isLoading={addLoading}
                onClick={createParticipation}
              >
                Ilmoittaudu
              </PrimaryButton>
            )}
          </FlexWithMotion>
        </>
      )}
      {!challenge && !loading && (
        <>
          <Heading.H1>Oho!</Heading.H1>
          <Text fontSize="xl"> Haastetta ei id:llä {id} löytynyt:(</Text>
          <Text>Ylhäältä pääset takaisin haasteiden selaamiseen.</Text>
        </>
      )}
      {error && (
        <Text fontWeight="bold" color="warning">
          {error.message}
        </Text>
      )}
    </Box>
  );
};

export default ChallengePage;
