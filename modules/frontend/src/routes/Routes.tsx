import { ApolloQueryResult, useApolloClient } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import LoadingOverlay from "components/general/LoadingOverlay";
import ModalTemplate from "components/general/ModalTemplate";
import { GetUserQueryResult, GET_USER } from "generalQueries";
import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import useGlobal from "store";
import LoginPage from "views/login/LoginPage";
import MainPage from "views/main/MainPage";
import NotFoundPage from "views/NotFoundPage";
import WelcomePage from "views/welcome/WelcomePage";

const Routes = (): JSX.Element => {
  const [globalState, globalActions] = useGlobal();
  const [loading, setLoading] = useState(false);

  const client = useApolloClient();
  const currentUser = localStorage.getItem("currentUser");

  const updateCurrentUser = async (name: string) => {
    setLoading(true);
    try {
      const result: ApolloQueryResult<GetUserQueryResult> = await client.query({
        query: GET_USER,
        variables: {
          name,
        },
      });
      const { data } = result;
      globalActions.updateUser(data.getUser);
    } catch (err) {
      globalActions.updateError(
        `Käyttäjääsi ei löytynyt tai istuntosi on vanhentunut. Kokeile kirjautua uudestaan.`
      );
      localStorage.removeItem("currentUser");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (currentUser && !globalState.currentUser && !loading) {
      updateCurrentUser(currentUser);
    }
    if (!currentUser && globalState.currentUser) {
      globalActions.updateUser(null);
    }
  });

  return (
    <>
      <ModalTemplate
        hasOpenButton={false}
        headerLabel="Huppista! Jotakin meni pyllylleen:/"
        isOpen={!!globalState.error}
        onClose={() => globalActions.updateError(null)}
      >
        <Text color="warning" fontWeight="bold">
          {globalState.error}
        </Text>
      </ModalTemplate>
      <Route
        path="/login"
        render={() => {
          if (!globalState.currentUser) return <LoginPage />;
          return <Redirect to="/" />;
        }}
      />
      <Route
        render={() => {
          if (loading) {
            return <LoadingOverlay />;
          }
          if (!currentUser) {
            return <Redirect to="/login" />;
          }

          return (
            <Switch>
              <Route exact path="/" render={() => <MainPage />} />
              <Route path="/welcome" render={() => <WelcomePage />} />
              <Route path="*" render={() => <NotFoundPage />} />
            </Switch>
          );
        }}
      />
    </>
  );
};

export default Routes;
