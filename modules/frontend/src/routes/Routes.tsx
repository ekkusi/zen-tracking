import { ApolloQueryResult, useApolloClient } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import LoadingOverlay from "components/LoadingOverlay";
import ModalTemplate from "components/ModalTemplate";
import { GetUserQueryResult, GET_USER } from "generalQueries";
import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import useGlobal from "store";
import Login from "views/login/Login";
import Main from "views/main/Main";
import NotFoundPage from "views/NotFoundPage";

const Routes = (): JSX.Element => {
  const [globalState, globalActions] = useGlobal();
  const [loading, setLoading] = useState(false);

  const client = useApolloClient();
  const currentUser = localStorage.getItem("currentUser");

  console.log(!!currentUser);

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
        `Käyttäjääsi ei löytynyt tai istunto on vanhentunut. Kokeile kirjautua uudestaan.`
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
        renderOpenButton={false}
        headerLabel="Huppista! Jotakin meni pyllylleen:/"
        disclosureProps={{
          isOpen: !!globalState.error,
          onClose: () => globalActions.updateError(null),
        }}
      >
        <Text color="warning" fontWeight="bold">
          {globalState.error}
        </Text>
      </ModalTemplate>
      <Route
        path="/login"
        render={() => {
          if (!globalState.currentUser) return <Login />;
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
              <Route exact path="/" render={() => <Main />} />
              <Route path="*" render={() => <NotFoundPage />} />
            </Switch>
          );
        }}
      />
    </>
  );
};

export default Routes;
