import { useMutation, useQuery } from "@apollo/client";
import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";

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

const ChallengePage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const user = useGlobal((state) => state.currentUser)[0];
  const [activeParticipation, updateActiveParticipation] = useGlobal(
    (state) => state.activeParticipation,
    (actions) => actions.updateActiveParticipation
  );

  console.log(id);

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

  const challenge = useMemo(() => {
    return data?.getChallenge;
  }, [data]);

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

  const removeParticipation = async () => {
    try {
      await deleteParticipation();
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
      {/* <Spinner
        textAlign="center"
        color="primary.regular"
        size="xl"
        thickness="3px"
      /> */}
      {loading && <Loading />}
      {challenge && (
        <>
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="flex-start"
            alignItems="start"
            mb="3"
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
                  mr: { base: "0", sm: "4" },
                  mb: "3",
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
          </Flex>
          <Heading.H1 textAlign={{ base: "left", sm: "center" }}>
            {challenge.name}
          </Heading.H1>
        </>
      )}
      {error && (
        <Text fontWeight="bold" color="warning">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default ChallengePage;
