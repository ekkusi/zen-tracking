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
import TransferMarkingsPage from "views/transfer-markings/TransferMarkingsPage";

import { NO_PARTICIPATION_MARKINGS_HOLDER_NAME } from "@ekkusi/zen-tracking-backend/lib/config.json";
import SomeDesignPage from "views/design/SomeDesignPage";

const Routes = (): JSX.Element => {
  const [globalState, globalActions] = useGlobal();
  const [loading, setLoading] = useState(false);

  const { updateUser, updateActiveParticipation } = globalActions;
  const { activeParticipation, currentUser } = globalState;

  const client = useApolloClient();
  const localStorageUser = localStorage.getItem("currentUser");
  const localStorageActiveParticipationId = localStorage.getItem(
    "activeParticipationChallengeId"
  );

  const isGlobalUserAuthorized = (): boolean => {
    return currentUser.name !== notAuthorizedUser.name;
  };

  const shouldRenderTransferMarkings = (): boolean => {
    return (
      activeParticipation?.challenge.name ===
      NO_PARTICIPATION_MARKINGS_HOLDER_NAME
    );
  };

  const resetGlobalError = () => {
    globalActions.updateError(null);
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
      // Update activeParticipation as well when user is updated, wait for user to be updated first
      await globalActions.updateActiveParticipation(
        localStorageActiveParticipationId ?? undefined
      );
    } catch (err) {
      globalActions.updateError(
        `Käyttäjääsi ei löytynyt tai istuntosi on vanhentunut. Kokeile kirjautua uudestaan.`
      );
      localStorage.removeItem("currentUser");
      localStorage.removeItem("activeParticipationChallengeId");
    }

    setLoading(false);
  };

  // Handle logging in with localStorage cache
  useEffect(() => {
    let unmounted = false;

    // If currentUser localStorage variable is set but globalStorage user is not set (== is "not-authorized" user) -> get and update user
    if (
      localStorageUser &&
      !isGlobalUserAuthorized() &&
      !loading &&
      !unmounted
    ) {
      updateCurrentUser(localStorageUser);
    }
    // If localStorage currentUser is null but global storage is still logged in -> null global storage
    if (!localStorageUser && isGlobalUserAuthorized() && !unmounted) {
      updateUser(null);
      updateActiveParticipation(null);
    }
    return () => {
      unmounted = true;
    };
  });

  return (
    <>
      <ModalTemplate
        hasOpenButton={false}
        headerLabel="Huppista! Jotakin meni pyllylleen:/"
        isOpen={!!globalState.error}
        onClose={resetGlobalError}
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
        path="/transfer-markings"
        render={() => {
          if (shouldRenderTransferMarkings()) {
            return <TransferMarkingsPage />;
          }
          return <Redirect to="/" />;
        }}
      />
      <Route
        render={() => {
          if (loading) {
            return <LoadingOverlay />;
          }
          if (!localStorageUser) {
            return <Redirect to="/login" />;
          }
          if (shouldRenderTransferMarkings()) {
            return <Redirect to="/transfer-markings" />;
          }

          return (
            <>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => (
                    <ViewContainer>
                      <MainPage />
                    </ViewContainer>
                  )}
                />
                <Route
                  path="/challenges"
                  render={() => (
                    <ViewContainer>
                      <ChallengesPage />{" "}
                    </ViewContainer>
                  )}
                />
                <Route
                  path="/design"
                  render={() => (
                    <ViewContainer>
                      <DesignPage />
                    </ViewContainer>
                  )}
                />
                <Route path="/design-some" render={() => <SomeDesignPage />} />
                <Route path="/welcome" render={() => <WelcomePage />} />
                <Route path="*" render={() => <NotFoundPage />} />
              </Switch>
            </>
          );
        }}
      />
    </>
  );
};

export default Routes;
