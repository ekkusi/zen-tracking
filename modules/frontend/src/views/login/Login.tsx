import { ApolloQueryResult, useApolloClient } from "@apollo/client";
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { UserCheckResult } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { PrimaryButton } from "components/primitives/Button";
import { PrimaryInput } from "components/primitives/Input";
import React, { useEffect, useState } from "react";
import { CheckUserQueryResult, CHECK_USER } from "./loginQueries";

type LoginProps = {
  login: (username: string) => void;
};

const Login = ({ login }: LoginProps): JSX.Element => {
  const [opacityValues, setOpacityValues] = useState([0, 0, 0]);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [formValues, setFormValues] = useState({
    name: "",
    password: "",
    isPrivateUser: false,
  });
  const client = useApolloClient();

  // Change opacity of current indexz and move to next index in opacity animations
  const changeOpacity = () => {
    console.log("Changing opacity, current index ", animationIndex);
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
    const result: ApolloQueryResult<CheckUserQueryResult> = await client.query({
      query: CHECK_USER,
      variables: { name: formValues.name, password: formValues.password },
    });
    const data = result.data.checkUser;
    if (data === UserCheckResult.UserAndPasswordFound) {
      login(formValues.name);
    } else if (data === UserCheckResult.UserNotFoundButCreated) {
      alert("Account created!");
      console.log("Account created!");
      login(formValues.name);
    } else {
      alert("Given password was incorrect");
      console.log("Given password was incorrect");
    }
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") handleFormSubmit();
  };

  return (
    <Flex>
      <Box>
        <Heading
          as="h1"
          size="4xl"
          mt="10"
          mb="3"
          opacity={opacityValues[0]}
          transition="opacity 2s"
        >
          Tervehdys!
        </Heading>
        <Heading
          as="h2"
          size="lg"
          fontWeight="normal"
          mb="4"
          opacity={opacityValues[1]}
          transition="opacity 2s"
        >
          2020 on karisteltu ja on myös <strong>SINUN</strong> aikasi aloittaa
          elämä ilman mielen jatkuvaa sabotointia. Liity siis{" "}
          <Text as="span" fontWeight="bold" fontStyle="italic">
            Unleash your inner ZEN
          </Text>{" "}
          yhteisön (<strong>HUOM!</strong> ei siis kultti) Suomen osaseuraan ja
          ota ensiaskeleet kohti kehon, mielen sekä sydämen hyvinvointia.
        </Heading>
        <Box opacity={opacityValues[2]} transition="opacity 2s">
          <Heading as="h3" size="md" mb="4">
            Syötä vain alla olevaan laatikkoon nimesi tai nimimerkki (esim.
            henkiolentosi tai edellisen meditaatiosi mantra) ja salasana, niin
            olet valmis aloittamaan terveellisen putkesi seuraamisen muiden
            kanssazenittäjien seurassa!
          </Heading>
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
              Jos tämä on ensimmäinen kirjautumisesi sekä haluat haluat rikkoa
              yhteisöllisyyttä ja pitää tietosi omana hyvänäsi piilossa muilta
              kanssazenittäjiltä, niin ruksi tämä.
            </Checkbox>
            <PrimaryButton onClick={handleFormSubmit}>
              Kirjaudu sisään
            </PrimaryButton>
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
