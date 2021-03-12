import { useApolloClient } from "@apollo/client";
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PrimaryButton } from "components/primitives/Button";
import { PrimaryInput } from "components/primitives/Input";
import Heading from "components/primitives/Heading";
import React, { useEffect, useState } from "react";
import useGlobal from "store";
import { useHistory } from "react-router-dom";
import { UserCheckStatus } from "__generated__/globalTypes";
import { CHECK_USER } from "./loginQueries";
import {
  CheckUserQuery,
  CheckUserQueryVariables,
} from "./__generated__/CheckUserQuery";

const LoginPage = (): JSX.Element => {
  const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");

  console.log(hasLoggedInBefore);

  // If user has visited logged in before already, show form straight away
  const [opacityValues, setOpacityValues] = useState(
    hasLoggedInBefore ? [1, 1, 1] : [0, 0, 0]
  );
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
  const updateActiveParticipation = useGlobal(
    (store) => store.activeParticipation,
    (actions) => actions.updateActiveParticipation
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
    // If user has already visited login page, no need to animate
    if (!hasLoggedInBefore) {
      if (animationIndex === 0) {
        setTimeout(changeOpacity, 50);
      }
      if (animationIndex < opacityValues.length) {
        setTimeout(changeOpacity, 1000);
      }
    }
  });

  const handleFormSubmit = async () => {
    if (!formValues.name) setError("Käyttäjätunnus ei voi olla tyhjä");
    else if (!formValues.password) setError("Salasana ei voi olla tyhjä");
    else {
      // Set hasLoggedInBefore to prevent next visit animations, if this is not set already
      if (!hasLoggedInBefore) localStorage.setItem("hasLoggedInBefore", "true");
      setError(undefined);
      setLoading(true);
      try {
        const result = await client.query<
          CheckUserQuery,
          CheckUserQueryVariables
        >({
          query: CHECK_USER,
          variables: { name: formValues.name, password: formValues.password },
        });
        const data = result.data.checkUser;
        // If user is returned from query, password is correct or user is created
        if (data.user) {
          updateUser(data.user);
          await updateActiveParticipation();
        }
        if (data.status === UserCheckStatus.USER_NOT_FOUND_BUT_CREATED) {
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
    <Container maxWidth="1000px">
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
    </Container>
  );
};

export default LoginPage;
