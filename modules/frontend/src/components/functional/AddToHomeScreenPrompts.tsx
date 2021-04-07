import React, { useState } from "react";
import { Button, Flex, Text, useMediaQuery } from "@chakra-ui/react";

import { DownloadIcon } from "@chakra-ui/icons";
import ModalTemplate from "../general/ModalTemplate";
import Heading from "../primitives/Heading";
import useGlobal from "../../store";
import theme from "../../theme";

export default function AddToHomeScreenPrompt() {
  const [promptEvent, updatePromptEvent] = useGlobal(
    (state) => state.promptEvent,
    (actions) => actions.updatePromptEvent
  );

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile] = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const userHasSeenInstallPrompt = localStorage.getItem(
    "hasUserSeenInstallPrompt"
  );

  window.addEventListener(
    "beforeinstallprompt",
    (event) => {
      console.log("beforeinstallprompt triggered: ", event);
      updatePromptEvent(event);
    },
    { passive: true }
  );

  window.addEventListener("appinstalled", (event: any) => {
    console.log("appinstalled triggered", event);
    localStorage.setItem("hasUserSeenInstallPrompt", "true");
    setIsOpen(false);
  });

  if (!userHasSeenInstallPrompt && promptEvent && isMobile) {
    return (
      <ModalTemplate
        hasOpenButton={false}
        hasHeader={false}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          localStorage.setItem("hasUserSeenInstallPrompt", "true");
        }}
        closeButtonLabel="En halua testata"
        headerLabel="Sovelluksen asentaminen"
        modalBodyProps={{ pt: 5 }}
      >
        <>
          <Heading.H2>
            Oletko vielä testannut Zen trackingia sovelluksena?
          </Heading.H2>
          <Text>
            Tekemällä sivustosta pikakuvakkeen kotinäytöllesi, saat sivuston
            toimimaan aivan normaalin mobiilisovelluksen kaltaisesti. Zen
            trackingin tietyt toiminnallisuudet ovat huomattavasti sulavampia
            tämän kautta. Tällöin sinun ei tarvitse myöskään aukaista enää
            selainta ja navigoida tähän osoitteeseen päivän merkkausta
            laittaaksesi!
          </Text>
          <Text>
            Voit testata Zen trackingia sovelluksena asettamalla kuvakkeen
            kotinäytölle seuraavasta painikkeesta!
          </Text>
          <Flex justifyContent="center" mb="5">
            <Button
              onClick={() => {
                if (promptEvent) {
                  promptEvent.prompt();
                }
              }}
              size="lg"
              rightIcon={<DownloadIcon />}
            >
              Lisää kotinäytölle
            </Button>
          </Flex>
        </>
      </ModalTemplate>
    );
  }

  return null;
}
