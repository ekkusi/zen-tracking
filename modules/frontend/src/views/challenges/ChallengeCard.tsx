import { useMutation } from "@apollo/client";
import {
  Flex,
  FlexProps,
  LightMode,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { PrimaryButton } from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import React from "react";
import useGlobal from "store";
import DateUtil from "util/DateUtil";
import EditChallenge from "components/EditChallenge";
import {
  DeteleParticipationMutation,
  DeteleParticipationMutationVariables,
} from "./__generated__/DeteleParticipationMutation";
import { CREATE_PARTICIPATION, DELETE_PARTICIPATION } from "./queries";
import {
  CreateParticipationMutation,
  CreateParticipationMutationVariables,
} from "./__generated__/CreateParticipationMutation";
import { GetChallengesQuery_getChallenges } from "./__generated__/GetChallengesQuery";
import DeleteConfimationModal from "../../components/DeleteConfirmationModal";

type ChallengeCardProps = FlexProps & {
  challenge: GetChallengesQuery_getChallenges;
  onEdit: () => Promise<void>;
  onDelete: () => Promise<void>;
  updateChallenges: () => Promise<void>;
};

const ChallengeCard = ({
  challenge,
  onEdit,
  onDelete,
  updateChallenges,
  ...rest
}: ChallengeCardProps): JSX.Element => {
  const user = useGlobal((state) => state.currentUser)[0];
  const { colorMode } = useColorMode();

  const [activeParticipation, updateActiveParticipation] = useGlobal(
    (state) => state.activeParticipation,
    (actions) => actions.updateActiveParticipation
  );
  const [addParticipation, { loading: addLoading }] = useMutation<
    CreateParticipationMutation,
    CreateParticipationMutationVariables
  >(CREATE_PARTICIPATION, {
    variables: {
      challengeId: challenge.id,
    },
  });

  const [deleteParticipation] = useMutation<
    DeteleParticipationMutation,
    DeteleParticipationMutationVariables
  >(DELETE_PARTICIPATION, {
    variables: {
      challengeId: challenge.id,
    },
  });

  const removeParticipation = async () => {
    try {
      await deleteParticipation();
      await updateChallenges();
      // If deletedParticipation was the activeParticipation, update activeParticipation
      if (
        activeParticipation &&
        activeParticipation.challenge.id === challenge.id
      ) {
        updateActiveParticipation(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const createParticipation = async () => {
    try {
      const result = await addParticipation();
      await onEdit();
      // If activeparticipation isn't updated by updateChallenges -> update manually with created challenge
      if (!activeParticipation && result.data) {
        updateActiveParticipation(result.data.createParticipation);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserParticipation = () => {
    const participation = challenge.participations.find(
      (it) => it.user.name === user.name
    );
    return participation;
  };

  const isUserChallengeCreator = () => {
    return challenge.creator.name === user.name;
  };

  return (
    <Flex
      direction="column"
      borderRadius="10px"
      boxShadow={colorMode === "light" ? "base" : "dark-lg"}
      width={{ base: "100%", sm: "300px" }}
      height="300px"
      py="5"
      px="7"
      bg={colorMode === "light" ? "white" : "gray.50"}
      color="text.light"
      {...rest}
    >
      <LightMode>
        {activeParticipation?.challenge.id === challenge.id && (
          <Text as="span" color="primary.regular">
            Aktiivinen haaste
          </Text>
        )}
        <Text as="span" fontStyle="italic" mb="0">
          {challenge.startDate && challenge.endDate
            ? `${DateUtil.format(challenge.startDate)} -
            ${DateUtil.format(challenge.endDate)}`
            : "Ei päätettyä ajankohtaa"}
        </Text>
        <Text as="span" mb="3">
          Ilmoittautuneita: {challenge.participations.length}
        </Text>

        <Text fontSize="md" overflow="hidden">
          {challenge.description}
        </Text>
        <Heading.H3 mb="0">{challenge.name}</Heading.H3>
      </LightMode>

      {isUserChallengeCreator() && (
        <EditChallenge
          challenge={challenge}
          onEdit={onEdit}
          onDelete={onDelete}
          openButtonLabel="Muokkaa"
          openButtonProps={{ size: "xs", mt: "auto" }}
        />
      )}
      {getUserParticipation() ? (
        <>
          <DeleteConfimationModal
            onDelete={removeParticipation}
            openButtonLabel="Poista ilmoittautuminen"
            headerLabel="Poista ilmoittautuminen"
            openButtonProps={{
              mt: isUserChallengeCreator() ? "2" : "auto",
            }}
          >
            <Text>
              Oletko varma, että haluat poistaa ilmoittautumisesi haasteesta{" "}
              {challenge.name}? Jos sinulla on merkkauksia kyseiseen
              haasteeseen, poistuvat nekin.
            </Text>
          </DeleteConfimationModal>
        </>
      ) : (
        <PrimaryButton
          isLoading={addLoading}
          mt={isUserChallengeCreator() ? "2" : "auto"}
          onClick={createParticipation}
        >
          Ilmoittaudu
        </PrimaryButton>
      )}
    </Flex>
  );
};

export default ChallengeCard;
