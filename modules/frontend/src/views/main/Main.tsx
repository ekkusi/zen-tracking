import { Box, Heading, Spinner, Stack, Tag, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { QueryResult, useQuery } from "@apollo/client";
import { User, Marking } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { PrimaryButton } from "components/primitives/Button";
import ModalTemplate from "components/ModalTemplate";
import { GetUserQueryResult, GET_USER } from "./queries";
import AddMarking from "./AddMarking";

type MainProps = {
  logout: () => void;
};

const Main = ({ logout }: MainProps): JSX.Element => {
  const [user, setUser] = useState<User | null>();
  const currentUser = localStorage.getItem("currentUser");

  const { loading, error, data }: QueryResult<GetUserQueryResult> = useQuery(
    GET_USER,
    {
      variables: { name: currentUser },
    }
  );

  useEffect(() => {
    if (!user && data) {
      setUser({ ...data.getUser });
    }
  }, [data, user]);

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
        <PrimaryButton ml="3" onClick={logout}>
          Kirjaudu ulos
        </PrimaryButton>
      </Box>
      <Heading as="h1" size="xl" mt="5" mb="5">
        Tervehdys {currentUser}:) Tervetuloa seuraamaan zenisi kasvamista!
      </Heading>
      <Heading as="h2" size="lg" fontWeight="normal" mb="5">
        <Text as="span" fontStyle="italic">
          Tammikuun haaste:
        </Text>{" "}
        herää kello 7 ja vietä rauhallinen aamu ilman ruutujen häirintää.
      </Heading>
      {loading && <Spinner loading={loading} color="primary.regular" />}
      {user && user.markings.length > 0 ? (
        <Box mb="3">
          <Heading as="h2" size="lg" mb="2">
            Olet merkannut {user.markings.length} päivän osalta!
          </Heading>
          <Stack direction="row">
            {user.markings.map((it: Marking) => (
              <Tag type="solid" bg="secondary.regular" color="white">
                {new Date(it.date).toISOString()}
              </Tag>
            ))}
          </Stack>
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
