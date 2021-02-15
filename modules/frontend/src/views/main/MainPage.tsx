import { Box, Flex, Text } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import React from "react";
import { PrimaryButton } from "components/primitives/Button";
import ModalTemplate from "components/general/ModalTemplate";
import useGlobal from "store";
import Heading from "components/primitives/Heading";
import DateUtil from "util/DateUtil";
import MarkingCalendar from "../../components/MarkingCalendar";
import AddMarking from "../../components/AddMarking";

const MainPage = (): JSX.Element => {
  const [user, updateUser] = useGlobal(
    (store) => store.currentUser,
    (actions) => actions.updateUser
  );

  const hasUserMarkedToday = () => {
    return DateUtil.dateIsIn(
      new Date(),
      user ? user.markings.map((it) => new Date(it.date)) : []
    );
  };

  return (
    <Box pt="5">
      <Box>
        <ModalTemplate
          openButtonLabel="Ohjeita"
          headerLabel="Ohjeita"
          closeButtonLabel="Sulje ohjeet"
        >
          <>
            <Text>
              Kun olet mielestäsi onnistunut suorittamaan kyseisen tehtävän
              päivän osalta, paina alta päivä suoritetuksi ja saat suorituksen
              putkeesi kasvattamaan vihreätä linjaa!
            </Text>
            <Text>
              Voit halutessasi lisätä merkkaukseen aamun aktiviteetin, mikäli
              haluat kartoittaa myös suorituksiasi näissä aktiviteeteissa.
              Listassa on valmiina muutamia yleisiä zeniä kasvattavia
              vaihtoehtoja, mutta koska jokainen zeni on uniikki lumihiutale,
              voit myös lisätä oman zeniä kasvattavan aktiviteettisi olemassa
              olevaan listaan.
            </Text>
            <Text>
              Voit myös lisätä päivästä kommentin aamun fiiliksistä,
              aktiviteetin suoriutumisesta tai mistä vaan! Näiden kommenttien
              pohjalta voit reflektoida haastetta jälkeenpäin, kun muisti alkaa
              yksittäisten päivien osalta pettää:)
            </Text>
          </>
        </ModalTemplate>
        <PrimaryButton ml="3" onClick={() => updateUser(null)}>
          Kirjaudu ulos
        </PrimaryButton>
      </Box>
      <Heading.H1 mt="5">
        Tervehdys {user?.name} ja tervetuloa seuraamaan zenisi kasvamista :){" "}
      </Heading.H1>
      <Heading.H2 fontWeight="normal" mb={{ base: "6", md: "10" }}>
        <Text as="span" fontStyle="italic" fontSize="inherit">
          Tammikuun haaste:
        </Text>{" "}
        herää kello 7 ja vietä rauhallinen aamu ilman ruutujen häirintää.
      </Heading.H2>
      <Box mb="7">
        {user && user.markings.length > 0 ? (
          <>
            <Heading.H2 mb="4" textAlign={{ base: "left", sm: "center" }}>
              Putkesi pituus:{" "}
              <Text as="span" fontWeight="bold" fontSize="inherit">
                {DateUtil.getDateStreak(
                  user.markings.map((it) => new Date(it.date))
                )}{" "}
              </Text>
            </Heading.H2>
            <MarkingCalendar markings={user.markings} />
          </>
        ) : (
          <>
            <Heading.H2>Sinulla ei vielä ole merkkauksia.</Heading.H2>
            <Text fontSize="lg">
              Aloita ensimmäisen päivän merkkaaminen alta. Ylhäältä löydät
              tarvittaessa lisäohjeita.
            </Text>
          </>
        )}
      </Box>
      <Flex justifyContent={{ base: "flex-start", sm: "center" }}>
        <AddMarking
          modalTemplateProps={{
            openButtonLabel: hasUserMarkedToday()
              ? "Olet jo merkannut tänään"
              : "Merkkaa tämä päivä",
            openButtonProps: {
              fontSize: { base: "lg", md: "xl" },
              fontWeight: "normal",
              textTransform: "none",
              py: { base: 6, md: 8 },
              px: { base: 5, md: 7 },
              isDisabled: hasUserMarkedToday(),
              leftIcon: (
                <CheckIcon
                  w={{ base: 6, md: 8 }}
                  h={{ base: 6, md: 8 }}
                  mb="1px"
                />
              ),
            },
          }}
        />
      </Flex>
    </Box>
  );
};

export default MainPage;
