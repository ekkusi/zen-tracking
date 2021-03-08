import { useApolloClient } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import LoadingOverlay from "components/general/LoadingOverlay";
import ModalTemplate from "components/general/ModalTemplate";
import { GET_USER } from "generalQueries";
import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import useGlobal from "store";
import { notAuthorizedUser } from "store/notAuthenticatedUser";
import LoginPage from "views/login/LoginPage";
import MainPage from "views/main/MainPage";
import NotFoundPage from "views/NotFoundPage";
import WelcomePage from "views/welcome/WelcomePage";
import ChallengesPage from "views/challenges/ChallengesPage";
import {
  GetUserQuery,
  GetUserQueryVariables,
} from "__generated__/GetUserQuery";
import DesignPage from "views/design/DesignPage";
import ViewContainer from "views/ViewContainer";

const Routes = (): JSX.Element => {
  const [globalState, globalActions] = useGlobal();
  const [loading, setLoading] = useState(false);

  const client = useApolloClient();
  const currentUser = localStorage.getItem("currentUser");

  console.log(globalState);

  const isGlobalUserAuthorized = (): boolean => {
    return globalState.currentUser.name !== notAuthorizedUser.name;
  };

  const updateCurrentUser = async (name: string) => {
    setLoading(true);
    try {
      const result = await client.query<GetUserQuery, GetUserQueryVariables>({
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

  // Handle logging in with localStorage cache
  useEffect(() => {
    // If currentUser localStorage variable is set but globalStorage user is not set (== is "not-authorized" user) -> get and update user
    if (currentUser && !isGlobalUserAuthorized() && !loading) {
      updateCurrentUser(currentUser);
    }
    // If localStorage currentUser is null but global storage is still logged in -> null global storage
    if (!currentUser && isGlobalUserAuthorized()) {
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
          if (!isGlobalUserAuthorized()) return <LoginPage />;
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
            <ViewContainer>
              <Switch>
                <Route exact path="/" render={() => <MainPage />} />
                <Route path="/welcome" render={() => <WelcomePage />} />
                <Route path="/challenges" render={() => <ChallengesPage />} />
                <Route path="/design" render={() => <DesignPage />} />
                <Route path="*" render={() => <NotFoundPage />} />
              </Switch>
            </ViewContainer>
          );
        }}
      />
    </>
  );
};

export default Routes;
