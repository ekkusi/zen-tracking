import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Grid,
  GridItem,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import React, { useMemo } from "react";

import { Link, useHistory, useParams } from "react-router-dom";
import Heading from "../../../components/primitives/Heading";
import useGlobal from "../../../store";
import {
  CREATE_PARTICIPATION,
  DELETE_PARTICIPATION,
  GET_CHALLENGE,
} from "./queries";
import {
  CreateParticipation,
  CreateParticipationVariables,
} from "./__generated__/CreateParticipation";
import {
  DeleteParticipation,
  DeleteParticipationVariables,
} from "./__generated__/DeleteParticipation";
import {
  GetChallenge,
  GetChallengeVariables,
} from "./__generated__/GetChallenge";

import Loading from "../../../components/general/Loading";
import EditChallenge from "../../../components/functional/EditChallenge";
import DeleteConfimationModal from "../../../components/general/DeleteConfirmationModal";
import DateUtil from "../../../util/DateUtil";

const ChallengePage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const user = useGlobal((state) => state.currentUser)[0];
  const [activeParticipation, updateActiveParticipation] = useGlobal(
    (state) => state.activeParticipation,
    (actions) => actions.updateActiveParticipation
  );

  const history = useHistory();

  const { data, loading, error, refetch } = useQuery<
    GetChallenge,
    GetChallengeVariables
  >(GET_CHALLENGE, {
    variables: {
      id,
    },
    fetchPolicy: "network-only",
  });

  const [addParticipation, { loading: addLoading }] = useMutation<
    CreateParticipation,
    CreateParticipationVariables
  >(CREATE_PARTICIPATION, {
    variables: {
      challengeId: id,
      isPrivate: false,
    },
  });

  const [deleteParticipation] = useMutation<
    DeleteParticipation,
    DeleteParticipationVariables
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
              <Text as="span" fontWeight="bold">
                Aika:{" "}
              </Text>
              {dateString}
            </GridItem>
            <GridItem as="span">
              <Text as="span" fontWeight="bold">
                Tekijä:{" "}
              </Text>
              {challenge.creator.name}
            </GridItem>
            <GridItem as="span">
              <Text as="span" fontWeight="bold">
                Osallistujia:{" "}
              </Text>
              {challenge.participations.length}
            </GridItem>
          </Grid>
          <Heading.H2>Kuvaus</Heading.H2>
          <Text mb="5">{challenge.description}</Text>
          <Heading.H2>Osallistujat</Heading.H2>
          {challenge.participations.length > 0 ? (
            <UnorderedList>
              {challenge.participations.map((it) => (
                <ListItem key={it.id}>
                  <Link to={`/profile/${it.user.name}`}>{it.user.name}</Link>
                </ListItem>
              ))}
            </UnorderedList>
          ) : (
            <Text>
              Kukaan ei ole vielä ilmottautunut haasteeseen. Ole ensimmäinen ja
              ilmoittaudu alta!
            </Text>
          )}

          <Box mt="5">
            {getUserParticipation() ? (
              <>
                <DeleteConfimationModal
                  onDelete={removeParticipation}
                  openButtonLabel="Poista ilmoittautuminen"
                  openButtonProps={{ mr: "4" }}
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
              <Button
                isLoading={addLoading}
                onClick={createParticipation}
                mr="4"
              >
                Ilmoittaudu
              </Button>
            )}
            {isUserChallengeCreator() && (
              <EditChallenge
                challenge={challenge}
                onEdit={() => {
                  refetch();
                }}
                onDelete={() => history.push("/challenges")}
                openButtonLabel="Muokkaa"
              />
            )}
          </Box>
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
