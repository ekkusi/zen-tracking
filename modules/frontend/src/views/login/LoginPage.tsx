import { ApolloQueryResult, useApolloClient } from "@apollo/client";
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Stack,
  Text,
} from "@chakra-ui/react";
import { UserCheckStatus } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { PrimaryButton } from "components/primitives/Button";
import { PrimaryInput } from "components/primitives/Input";
import Heading from "components/primitives/Heading";
import React, { useEffect, useState } from "react";
import useGlobal from "store";
import { useHistory } from "react-router-dom";
import { CheckUserQueryResult, CHECK_USER } from "./loginQueries";

const LoginPage = (): JSX.Element => {
  const [opacityValues, setOpacityValues] = useState([0, 0, 0]);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [formValues, setFormValues] = useState({
    name: "",
    password: "",
    isPrivateUser: false,
  });
  const updateUser = useGlobal(
    (store) => store.currentUser,
    (actions) => actions.updateUser
  )[1];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const history = useHistory();

  const client = useApolloClient();

  // Change opacity of current indexz and move to next index in opacity animations
  const changeOpacity = () => {
    const newValues = [...opacityValues];
    newValues[animationIndex] = 100;
    setOpacityValues(newValues);
    setAnimationIndex(animationIndex + 1);
  };

  useEffect(() => {
    // Animate boxes to appear in two second intervals, useEffect is automatically called again if state is changed
    // Start first animation immediately (still setTimeout to not change before first render)
    if (animationIndex === 0) {
      setTimeout(changeOpacity, 50);
    }
    if (animationIndex < opacityValues.length) {
      setTimeout(changeOpacity, 1000);
    }
  });

  const handleFormSubmit = async () => {
    if (!formValues.name) setError("Käyttäjätunnus ei voi olla tyhjä");
    else if (!formValues.password) setError("Salasana ei voi olla tyhjä");
    else {
      setError(undefined);
      setLoading(true);
      try {
        const result: ApolloQueryResult<CheckUserQueryResult> = await client.query(
          {
            query: CHECK_USER,
            variables: { name: formValues.name, password: formValues.password },
          }
        );
        const data = result.data.checkUser;
        if (data.status === UserCheckStatus.UserAndPasswordFound) {
          updateUser(data.user || null);
        } else if (data.status === UserCheckStatus.UserNotFoundButCreated) {
          updateUser(data.user || null);
          history.push("/welcome");
        } else {
          setError("Antamasi salasana oli väärä");
        }
        setLoading(false);
      } catch (err) {
        setError("Jotakin meni vikaan kirjautumisessa");
        setLoading(false);
      }
    }
    return undefined;
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") handleFormSubmit();
  };

  return (
    <Flex>
      <Box>
        <Heading.H1
          fontSize={{ base: "5xl", md: "6xl" }}
          mt={{ base: "8", md: "10" }}
          mb={{ base: "2", md: "3" }}
          opacity={opacityValues[0]}
          transition="opacity 2s"
        >
          Tervehdys!
        </Heading.H1>
        <Heading.H2
          fontWeight="normal"
          opacity={opacityValues[1]}
          transition="opacity 2s"
        >
          2020 on karisteltu ja on myös <strong>SINUN</strong> aikasi aloittaa
          elämä ilman mielen jatkuvaa sabotointia. Liity siis{" "}
          <Text as="span" fontWeight="bold" fontStyle="italic">
            Unleash your inner ZEN
          </Text>{" "}
          yhteisöön (<strong>HUOM!</strong> ei siis kultti) ja ota ensiaskeleet
          kohti kehon, mielen sekä sydämen hyvinvointia.
        </Heading.H2>
        <Box opacity={opacityValues[2]} transition="opacity 2s">
          <Text>
            Syötä vain alla olevaan laatikkoon nimesi tai nimimerkki (esim.
            henkiolentosi tai edellisen meditaatiosi mantra) ja salasana, niin
            olet valmis aloittamaan terveellisen putkesi seuraamisen muiden
            kanssazenittäjien seurassa!
          </Text>
          <Stack spacing="4">
            <FormControl>
              <FormLabel id="name">Tunnus</FormLabel>
              <PrimaryInput
                placeholder="zeniukko97"
                type="text"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormValues({
                    ...formValues,
                    name: event.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel id="password">Salasana</FormLabel>
              <PrimaryInput
                placeholder="********"
                type="password"
                colorScheme="teal"
                onKeyPress={handleInputKeyPress}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormValues({ ...formValues, password: event.target.value })
                }
              />
            </FormControl>
            <Checkbox
              isChecked={formValues.isPrivateUser}
              onChange={(event) =>
                setFormValues({
                  ...formValues,
                  isPrivateUser: event.target.checked,
                })
              }
              colorScheme="teal"
            >
              <Text as="span" fontSize="sm">
                Jos tämä on ensimmäinen kirjautumisesi ja haluat rikkoa
                yhteisöllisyyttä pitämällä tietosi piilossa muilta
                kanssazenittäjiltä, niin ruksi tämä.
              </Text>
            </Checkbox>
            {error && <Text color="warning">{error}</Text>}
            <PrimaryButton
              isLoading={loading}
              loadingText="Kirjautuminen käynnissä"
              onClick={handleFormSubmit}
            >
              Kirjaudu sisään
            </PrimaryButton>
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginPage;
