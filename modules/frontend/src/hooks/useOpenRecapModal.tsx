import React from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { ADD_FINISHED_CHALLENGE } from "../generalQueries";
import useGlobal from "../store";
import { ParsedChallenge } from "../types/parsedBackendTypes";
import {
  AddFinishedChallenge,
  AddFinishedChallengeVariables,
} from "../__generated__/AddFinishedChallenge";

const useOpenRecapModal = () => {
  const setModal = useGlobal(
    () => {},
    (actions) => actions.setModal
  )[1];
  const user = useGlobal((state) => state.currentUser)[0];
  const history = useHistory();

  const [addFinishedChallenge] = useMutation<
    AddFinishedChallenge,
    AddFinishedChallengeVariables
  >(ADD_FINISHED_CHALLENGE);

  const openModal = (challenge: ParsedChallenge) => {
    setModal({
      onAccept: () => {
        setModal(null);
        history.push(`/profile/${user.name}/${challenge.id}`, {
          isRecap: true,
        });
      },
      onClose: () => {
        addFinishedChallenge({
          variables: { challengeId: challenge.id },
        });
      },
      children: (
        <Text>
          Haaste <i>{challenge.name}</i> on loppunut. Haluisitko kahtoo
          yhteenvedon suorituksestasi?
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
