import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { FaInstagram } from "react-icons/fa";
import React, { useState } from "react";
import { PrimaryButton } from "components/primitives/Button";
import ModalTemplate from "components/general/ModalTemplate";
import useGlobal from "store";
import Heading from "components/primitives/Heading";
import DateUtil from "util/DateUtil";
import ImageModal from "components/general/ImageModal";
import MarkingCalendar from "../../components/MarkingCalendar";
import AddMarking from "../../components/EditMarking";

import config from "../../config.json";

const quoteCreditsUrl = "https://www.instagram.com/motivaatiolauseet/";

const MainPage = (): JSX.Element => {
  const [user, updateUser] = useGlobal(
    (store) => store.currentUser,
    (actions) => actions.updateUser
  );
  const [quoteOfTheDayUrl, setQuoteOfTheDayUrl] = useState<string>();

  const hasUserMarkedToday = () => {
    return DateUtil.dateIsIn(
      new Date(),
      user ? user.markings.map((it) => new Date(it.date)) : []
    );
  };

  const openQuoteOfTheDay = () => {
    setQuoteOfTheDayUrl(
      `${config.QUOTE_PHOTOS_BASE_URL}/quote-${Math.ceil(
        Math.random() * config.NUMBER_OF_QUOTE_PHOTOS
      )}.jpg`
    );
  };

  return (
    <Box pt="5">
      <Flex
        flexDirection={{ base: "column", sm: "row" }}
        justifyContent={{ base: "center", sm: "flex-start" }}
      >
        <ModalTemplate
          openButtonLabel="Ohjeita"
          openButtonProps={{ mb: { base: "2", sm: "0" } }}
          headerLabel="Ohjeita"
          closeButtonLabel="Sulje ohjeet"
        >
          <>
            <Text>
              Kun olet mielestäsi onnistunut suorittamaan haasteen kyseisen
              päivän osalta, merkkaa alta päivä suoritetuksi ja saat suorituksen
              kasvattamaan putkeasi!
            </Text>
            <Text>
              Voit lisätä halutessasi kommentin päivän suorituksesta, päivän
              fiiliksistä tai mistä vaan! Näiden kommenttien pohjalta voit
              esimerkiksi reflektoida haastetta jälkeenpäin, kun muisti on
              alkanut yksittäisten päivien osalta hämärtyä.
            </Text>
            <Text>
              Mikäli et ole piilottanut tietojasi muilta käyttäjiltä
              kirjautuessasi sisään ensimmäistä kertaa, näkyvät nämä kommentit
              muille samaista haastetta suorittaville käyttäjille. Tällä tavoin
              voi kaikki haluavat suorittaa haastetta yhdessä ja katsoa, kuinka
              muilla sujuu samaisen haasteen eteneminen!
            </Text>
            <Heading.H3 fontWeight="bold">
              Merkkausten muokkaus jälkikäteen
            </Heading.H3>
            <Text>
              Merkattuasi ensimmäisen suorituksen voit muokata jo tekemiäsi
              merkkauksia painamalla kalenterista jotakin päivää, jolloin
              muokkausikkuna aukeaa. Jos päivällä on jo merkkaus, voit tästä
              ikkunasta joko muokata merkkauksen tietoja tai poistaa
              merkkauksen. Jos avatulla päivällä ei ole vielä merkkausta, voit
              tästä lisätä merkkauksen jälkikäteen, mikäli et edellisinä päivinä
              sitä ehtinyt tekemään. Etukäteen et kuitenkaan tulevia päiviä voi
              merkata, koska tarkoituksena on merkkailla suorituksia vasta
              niiden toteuduttua:)
            </Text>
          </>
        </ModalTemplate>
        <PrimaryButton
          ml={{ base: "0", sm: "3" }}
          mb={{ base: "2", sm: "0" }}
          variant="outline"
          onClick={openQuoteOfTheDay}
        >
          Quote of the Day
        </PrimaryButton>
        <PrimaryButton
          onClick={() => updateUser(null)}
          ml={{ base: "0", sm: "auto" }}
        >
          Kirjaudu ulos
        </PrimaryButton>
      </Flex>
      {quoteOfTheDayUrl && (
        <ImageModal
          isOpen={!!quoteOfTheDayUrl}
          onClose={() => setQuoteOfTheDayUrl(undefined)}
          src={quoteOfTheDayUrl}
          alt={quoteOfTheDayUrl}
          imgText={
            <>
              <Text as="a" color="white" target="_blank" href={quoteCreditsUrl}>
                <Icon as={FaInstagram} mb="2px" mr="1" />
                motivaatiolauseet
              </Text>
            </>
          }
        />
      )}
      <Heading.H1 mt="5">
        Tervehdys {user?.name} ja tervetuloa seuraamaan zenisi kasvamista :){" "}
      </Heading.H1>
      <Heading.H2 fontWeight="normal" mb={{ base: "6", md: "10" }}>
        <Text as="span" fontStyle="italic">
          Tammikuun haaste:
        </Text>{" "}
        herää kello 7 ja vietä rauhallinen aamu ilman ruutujen häirintää.
      </Heading.H2>
      {hasUserMarkedToday() ? (
        "Olet jo merkannut tänään"
      ) : (
        <Flex justifyContent={{ base: "flex-start", sm: "center" }} mb="7">
          <AddMarking
            openButtonLabel="Merkkaa päivän suoritus"
            openButtonProps={{
              isDisabled: hasUserMarkedToday(),
              size: "lg",
              leftIcon: (
                <CheckIcon
                  w={{ base: 6, md: 8 }}
                  h={{ base: 6, md: 8 }}
                  mb="1px"
                />
              ),
            }}
          />
        </Flex>
      )}
      <Box>
        {user && user.markings.length > 0 ? (
          <>
            <Heading.H2 mb="4" textAlign={{ base: "left", sm: "center" }}>
              Putkesi pituus:{" "}
              <Text as="span" fontWeight="bold">
                {DateUtil.getDateStreak(
                  user.markings.map((it) => new Date(it.date))
                )}{" "}
              </Text>
            </Heading.H2>
            <MarkingCalendar markings={user.markings} />
          </>
        ) : (
          <>
            <Heading.H2 fontWeight="bold">
              Sinulla ei vielä ole merkkauksia.
            </Heading.H2>
            <Text fontSize="lg">
              Aloita ensimmäisen merkkaaminen ylemmästä painikkeesta painamalla.
              Ylhäältä löydät tarvittaessa lisäohjeita.
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MainPage;
