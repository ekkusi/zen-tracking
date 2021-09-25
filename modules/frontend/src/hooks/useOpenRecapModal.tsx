import React from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { ADD_FINISHED_PARTICIPATION } from "../generalQueries";
import useGlobal from "../store";
import { ActiveParticipation } from "../store/types";
import {
  AddFinishedParticipation,
  AddFinishedParticipationVariables,
} from "../__generated__/AddFinishedParticipation";

const useOpenRecapModal = () => {
  const setModal = useGlobal(
    () => {},
    (actions) => actions.setModal
  )[1];
  const history = useHistory();

  const [addFinishedParticipation] = useMutation<
    AddFinishedParticipation,
    AddFinishedParticipationVariables
  >(ADD_FINISHED_PARTICIPATION);

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
        addFinishedParticipation({
          variables: { id: participation.id },
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
