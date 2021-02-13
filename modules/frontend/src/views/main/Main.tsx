import { Box, Heading, Stack, Tag, Text } from "@chakra-ui/react";
import React from "react";
import { Marking } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { PrimaryButton } from "components/primitives/Button";
import ModalTemplate from "components/ModalTemplate";
import useGlobal from "store";
import { format } from "date-fns";
import MarkingCalendar from "../../components/MarkingCalendar";
import AddMarking from "./AddMarking";

const Main = (): JSX.Element => {
  const [user, updateUser] = useGlobal(
    (store) => store.currentUser,
    (actions) => actions.updateUser
  );

  console.log(user);

  return (
    <Box>
      <Box pt="5">
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
      <Heading as="h1" size="xl" mt="5" mb="5">
        Tervehdys {user?.name}:) Tervetuloa seuraamaan zenisi kasvamista!
      </Heading>
      <Heading as="h2" size="lg" fontWeight="normal" mb="5">
        <Text as="span" fontStyle="italic">
          Tammikuun haaste:
        </Text>{" "}
        herää kello 7 ja vietä rauhallinen aamu ilman ruutujen häirintää.
      </Heading>
      {user && user.markings.length > 0 ? (
        <Box mb="3">
          <Heading as="h2" size="lg" mb="2">
            Suorituksesi: {user.markings.length}
          </Heading>
          <Stack direction="row" mb="10">
            {user.markings.map((it: Marking) => (
              <Tag
                key={it.id}
                type="solid"
                bg="secondary.regular"
                color="white"
              >
                {format(new Date(it.date), "yyyy.MM.dd HH:mm:ss")}
              </Tag>
            ))}
          </Stack>
          <MarkingCalendar markings={user.markings} />
        </Box>
      ) : (
        <>
          <Heading as="h2" size="lg">
            Sinulla ei vielä ole merkkauksia.
          </Heading>
          <Text fontSize="lg">
            Aloita ensimmäisen päivän merkkaaminen alta. Ylhäältä löydät
            tarvittaessa lisäohjeita.
          </Text>
        </>
      )}
      <AddMarking />
    </Box>
  );
};

export default Main;
