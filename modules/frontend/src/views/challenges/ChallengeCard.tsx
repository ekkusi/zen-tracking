import { useMutation } from "@apollo/client";
import { Flex, FlexProps, Text, useDisclosure } from "@chakra-ui/react";
import ModalTemplate from "components/general/ModalTemplate";
import {
  AlertButton,
  CancelButton,
  PrimaryButton,
} from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import React, { useState } from "react";
import useGlobal from "store";
import DateUtil from "util/DateUtil";
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

type ChallengeCardProps = FlexProps & {
  challenge: GetChallengesQuery_getChallenges;
};

const ChallengeCard = ({
  challenge,
  ...rest
}: ChallengeCardProps): JSX.Element => {
  const user = useGlobal((state) => state.currentUser)[0];
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addParticipation, { loading: addLoading }] = useMutation<
    CreateParticipationMutation,
    CreateParticipationMutationVariables
  >(CREATE_PARTICIPATION, {
    variables: {
      challengeId: challenge.id,
      userName: user.name,
    },
  });

  const [deleteParticipation, { loading: deleteLoading }] = useMutation<
    DeteleParticipationMutation,
    DeteleParticipationMutationVariables
  >(DELETE_PARTICIPATION, {
    variables: {
      challengeId: challenge.id,
      userName: user.name,
    },
  });

  const getUserParticipation = () => {
    const participation = challenge.participations.find(
      (it) => it.user.name === user.name
    );
    return participation;
  };

  return (
    <Flex
      direction="column"
      borderRadius="10px"
      boxShadow="base"
      width={{ base: "100%", sm: "300px" }}
      height="300px"
      py="5"
      px="7"
      {...rest}
    >
      <Heading.H3 mb="0">{challenge.name}</Heading.H3>

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
      {challenge.creator.name !== user.name && !!getUserParticipation() ? (
        <>
          <AlertButton
            color="white"
            bg="warning"
            mt="auto"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Poista ilmoittautuminen
          </AlertButton>
          <ModalTemplate
            hasOpenButton={false}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            headerLabel="Poista ilmoittautuminen"
            modalFooter={
              <>
                <AlertButton
                  isLoading={deleteLoading}
                  onClick={() =>
                    deleteParticipation()
                      .catch((e) => console.log(e))
                      .finally(() => setIsDeleteModalOpen(false))
                  }
                >
                  Poista
                </AlertButton>
                <CancelButton
                  isDisabled={deleteLoading}
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Peruuta
                </CancelButton>
              </>
            }
          >
            <Text>
              Oletko varma, että haluat poistaa ilmoittautumisesi haasteesta{" "}
              {challenge.name}? Jos sinulla on merkkauksia kyseiseen
              haasteeseen, poistuvat nekin.
            </Text>
          </ModalTemplate>
        </>
      ) : (
        <PrimaryButton
          isLoading={addLoading}
          mt="auto"
          onClick={() => addParticipation().catch((e) => console.log(e))}
        >
          Ilmoittaudu
        </PrimaryButton>
      )}
    </Flex>
  );
};

export default ChallengeCard;
