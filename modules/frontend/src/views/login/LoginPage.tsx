import { useMutation } from "@apollo/client";
import { Box, Container, Text } from "@chakra-ui/react";
import { PrimaryButton } from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import React, { useState } from "react";
import useGlobal from "store";
import { useHistory } from "react-router-dom";
import { Form, Formik } from "formik";
import { LOGIN } from "./loginQueries";
import FormField from "../../components/general/form/FormField";
import RegisterModal from "../../components/RegisterModal";
import { setAccessToken } from "../../util/accessToken";
import { Login, LoginVariables } from "./__generated__/Login";

type FormValues = {
  username: string;
  password: string;
};

const LoginPage = (): JSX.Element => {
  const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");
  const globalActions = useGlobal()[1];
  const history = useHistory();

  const [error, setError] = useState<string>();

  const [login, { loading }] = useMutation<Login, LoginVariables>(LOGIN);

  const validateName = (name: string) => {
    let validationError;
    if (name.length === 0) validationError = "Tunnus ei voi olla tyhjä";
    return validationError;
  };

  const validatePassword = (password: string) => {
    let validationError;
    if (password.length === 0) validationError = "Salasana ei voi olla tyhjä";
    return validationError;
  };

  const handleSubmit = async (values: FormValues) => {
    // Set hasLoggedInBefore to prevent next visit animations, if this is not set already
    if (!hasLoggedInBefore) localStorage.setItem("hasLoggedInBefore", "true");
    try {
      const { data } = await login({
        variables: {
          name: values.username,
          password: values.password,
          activeParticipationChallengeId:
            localStorage.getItem("activeParticipationChallengeId") ?? undefined,
        },
      });
      // If user is returned from query, password is correct or user is created
      if (data) {
        const { accessToken, user } = data.login;
        globalActions.updateUser(user);
        globalActions.updateActiveParticipation(user.activeParticipation);
        setAccessToken(accessToken);
        history.push("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container pt="9">
      <Heading.H1>Kirjaudu sisään</Heading.H1>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values }) => (
          <Form>
            <FormField
              name="username"
              type="text"
              label="Tunnus"
              placeholder="zeniukko97"
              validate={validateName}
            />
            <FormField
              name="password"
              type="password"
              label="Salasana"
              placeholder="********"
              validate={validatePassword}
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") handleSubmit(values);
              }}
            />
            {error && <Text color="warning">{error}</Text>}
            <Box>
              <PrimaryButton
                type="submit"
                isLoading={loading}
                loadingText="Kirjaudutaan..."
              >
                Kirjaudu sisään
              </PrimaryButton>
            </Box>
          </Form>
        )}
      </Formik>
      <Box mt="3">
        <Text as="span" mr="2">
          Uusi käyttäjä?
        </Text>
        <RegisterModal
          openButtonLabel="Rekisteröidy tästä"
          openButtonProps={{ as: "a" }}
        />
      </Box>
    </Container>
  );
};

export default LoginPage;
