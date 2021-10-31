import React, { useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import {
  withServiceWorkerUpdater,
  ServiceWorkerUpdaterProps,
} from "@3m1/service-worker-updater";
import ModalTemplate from "../general/ModalTemplate";

const NewVersionPrompt = ({
  newServiceWorkerDetected,
  onLoadNewServiceWorkerAccept,
}: ServiceWorkerUpdaterProps): JSX.Element | null => {
  const [loading, setLoading] = useState(false);
  const updateVersion = () => {
    setLoading(true);
    onLoadNewServiceWorkerAccept();
  };

  if (newServiceWorkerDetected) {
    return (
      <ModalTemplate
        hasOpenButton={false}
        isOpen
        // onClose={updateVersion}
        headerLabel="Päivitä sovellus"
        modalFooter={
          <Flex justifyContent="center" mb="5">
            <Button onClick={updateVersion} isLoading={loading}>
              Päivitä sovellus
            </Button>
          </Flex>
        }
      >
        <Text>
          Zen Trackingista on uusi versio saatavilla! Päivitä sovellus alta
          saadaksesi kaiken pelittämmään, niin kuin pittääki.
        </Text>
      </ModalTemplate>
    );
  }

  return null;
};

export default withServiceWorkerUpdater(NewVersionPrompt);
