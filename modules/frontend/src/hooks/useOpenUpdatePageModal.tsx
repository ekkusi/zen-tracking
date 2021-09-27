import React from "react";
import { useMutation } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import { CHECK_LATEST_UPDATE } from "../generalQueries";
import useGlobal from "../store";
import { CheckLatestUpdate } from "../__generated__/CheckLatestUpdate";

const useOpenUpdatePageModal = () => {
  const setModal = useGlobal(
    () => {},
    (actions) => actions.setModal
  )[1];

  const [checkLatestUpdate] = useMutation<CheckLatestUpdate>(
    CHECK_LATEST_UPDATE
  );

  const openModal = () => {
    setModal({
      onAccept: () => {
        setModal(null);
        checkLatestUpdate()
          .then(() => {
            window.location.reload();
          })
          .catch((e) => {
            console.log(e);
          });
      },
      children: (
        <Text>
          Zen Trackingista on uusi versio saatavilla. Päivitä sovellus
          saadaksesi sen käyttöön ja sovelluksen toimimaan:)
        </Text>
      ),
      headerLabel: "Uusi versio saatavilla!",
      acceptLabel: "Päivitä sivu",
      hasOpenButton: false,
      isOpen: true,
      hasCancelButton: false,
    });
  };

  return openModal;
};

export default useOpenUpdatePageModal;
