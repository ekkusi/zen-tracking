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
      <Heading.H1 mt="5" mb="5">
        Tervehdys {user?.name}:) Tervetuloa seuraamaan zenisi kasvamista!
      </Heading.H1>
      <Heading.H2 fontWeight="normal" mb="5">
        <Text as="span" fontStyle="italic">
          Tammikuun haaste:
        </Text>{" "}
        herää kello 7 ja vietä rauhallinen aamu ilman ruutujen häirintää.
      </Heading.H2>
      <Box mb="7">
        {user && user.markings.length > 0 ? (
          <>
            <Heading.H2 mb="5" textAlign={{ base: "left", sm: "center" }}>
              Putkesi pituus:{" "}
              <Text as="span" fontWeight="bold">
                {DateUtil.getDateStreak(
                  user.markings.map((it) => new Date(it.date))
                )}{" "}
              </Text>
            </Heading.H2>

            {/* <Stack direction="row" mb="10">
            {user.markings.map((it: Marking) => (
              <Tag
                key={it.id}
                type="solid"
                bg="secondary.regular"
                color="white"
              >
                {DateUtil.format(it.date)}
              </Tag>
            ))}
          </Stack> */}
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
              size: "lg",
              fontSize: "xl",
              fontWeight: "normal",
              textTransform: "none",
              py: "8",
              px: "7",
              isDisabled: hasUserMarkedToday(),
              leftIcon: <CheckIcon w={8} h={8} mb="1px" />,
            },
          }}
        />
      </Flex>
    </Box>
  );
};

export default MainPage;
