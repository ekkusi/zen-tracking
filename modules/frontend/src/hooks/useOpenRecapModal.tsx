import React from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { ADD_FINISHED_CHALLENGE } from "../generalQueries";
import useGlobal from "../store";
import {
  AddFinishedChallenge,
  AddFinishedChallengeVariables,
} from "../__generated__/AddFinishedChallenge";
import { ActiveParticipation } from "../store/types";

const useOpenRecapModal = () => {
  const setModal = useGlobal(
    () => {},
    (actions) => actions.setModal
  )[1];
  const history = useHistory();

  const [addFinishedChallenge] = useMutation<
    AddFinishedChallenge,
    AddFinishedChallengeVariables
  >(ADD_FINISHED_CHALLENGE);

  const openModal = (participation: ActiveParticipation, userName: string) => {
    setModal({
      onAccept: () => {
        setModal(null);
        history.push(
          `/profile/${userName}/participations/${participation.id}`,
          {
            isRecap: true,
          }
        );
      },
      onClose: () => {
        addFinishedChallenge({
          variables: { challengeId: participation.challenge.id },
        });
      },
      children: (
        <Text>
          Haaste <i>{participation.challenge.name}</i> on loppunut. Haluisitko
          kahtoo yhteenvedon suorituksestasi?
        </Text>
      ),
      headerLabel: "Haaste on päättynyt",
      acceptLabel: "Siirry yhteenvetoon",
      hasOpenButton: false,
      isOpen: true,
    });
  };

  return openModal;
};

export default useOpenRecapModal;
