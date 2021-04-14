import { useApolloClient } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import LoadingOverlay from "components/general/LoadingOverlay";
import ModalTemplate from "components/general/ModalTemplate";
import { GET_CURRENT_USER } from "generalQueries";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import ReactGA from "react-ga";

import useGlobal from "store";
import { notAuthorizedUser } from "store/notAuthenticatedUser";
import LoginPage from "views/login/LoginPage";
import MainPage from "views/main/MainPage";
import NotFoundPage from "views/NotFoundPage";
import WelcomePage from "views/welcome/WelcomePage";
import ChallengesPage from "views/challenges/ChallengesPage";
import DesignPage from "views/design/DesignPage";
import ViewContainer from "views/ViewContainer";
import TransferMarkingsPage from "views/transfer-markings/TransferMarkingsPage";

import { NO_PARTICIPATION_MARKINGS_HOLDER_NAME } from "@ekkusi/zen-tracking-backend/lib/config.json";
import SomeDesignPage from "views/design/SomeDesignPage";
import WelcomeUserPage from "../views/welcome-user/WelcomeUserPage";
import { refreshToken } from "../util/accessToken";
import ChallengePage from "../views/challenges/challenge/ChallengePage";
import {
  GetCurrentUser,
  GetCurrentUserVariables,
} from "../__generated__/GetCurrentUser";
import ProfilePage from "../views/profile/ProfilePage";
import ParticipationPage from "../views/profile/participation/ParticipationPage";

const NON_AUTHENTICATED_PATHS = ["/welcome", "/login"];

const Routes = (): JSX.Element => {
  const [globalState, globalActions] = useGlobal();
  const [loading, setLoading] = useState(true);
  const [hasTriedLoggingIn, setHasTriedLoggingIn] = useState(false);
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);

  const { activeParticipation, currentUser } = globalState;

  const client = useApolloClient();

  const isGlobalUserAuthorized = useMemo((): boolean => {
    return currentUser.name !== notAuthorizedUser.name;
  }, [currentUser]);

  const shouldRenderTransferMarkings = (): boolean => {
    return (
      activeParticipation?.challenge.name ===
      NO_PARTICIPATION_MARKINGS_HOLDER_NAME
    );
  };

  const resetGlobalError = () => {
    globalActions.updateError(null);
  };

  const history = useHistory();

  const updateCurrentUser = useCallback(async () => {
    await refreshToken();
    // If path that is rendered requires authentication, try fetch user.
    // If token has expired, ApolloProvider will throw an error and redirect to /login
    if (!NON_AUTHENTICATED_PATHS.includes(history.location.pathname)) {
      try {
        const result = await client.query<
          GetCurrentUser,
          GetCurrentUserVariables
        >({
          query: GET_CURRENT_USER,
          fetchPolicy: "no-cache",
          variables: {
            activeParticipationChallengeId:
              localStorage.getItem("activeParticipationChallengeId") ??
              undefined,
          },
        });
        const { data } = result;
        const {
          activeParticipation: newActiveParticipation,
          ...user
        } = data.getCurrentUser;
        globalActions.updateUser(user);
        // Update activeParticipation as well when user is updated, wait for user to be updated first
        globalActions.updateActiveParticipation(newActiveParticipation);
      } catch (err) {
        globalActions.updateUser(null);
      }
    }

    setLoading(false);
  }, [client, globalActions, history]);

  const currentPath = history.location.pathname;

  // Handle logging in with localStorage cache
  useEffect(() => {
    let isMounted = true;

    if (!hasTriedLoggingIn && isMounted) {
      setHasTriedLoggingIn(true);
      updateCurrentUser();
    }

    if (isMounted && previousRoute !== currentPath) {
      setPreviousRoute(currentPath);
      ReactGA.pageview(currentPath);
    }

    return () => {
      isMounted = false;
    };
  }, [
    hasTriedLoggingIn,
    updateCurrentUser,
    history,
    previousRoute,
    currentPath,
  ]);

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
      <Switch>
        <Route
          path="/login"
          render={() => {
            if (!isGlobalUserAuthorized) {
              return (
                <ViewContainer isPlain>
                  <LoginPage />
                </ViewContainer>
              );
            }

            return <Redirect to="/" />;
          }}
        />
        <Route
          path="/transfer-markings"
          render={() => {
            if (shouldRenderTransferMarkings()) {
              return (
                <ViewContainer isPlain>
                  <TransferMarkingsPage />
                </ViewContainer>
              );
            }
            return <Redirect to="/" />;
          }}
        />
        <Route
          path="/welcome"
          render={() => {
            return (
              <ViewContainer isPlain>
                <WelcomePage />
              </ViewContainer>
            );
          }}
        />
        <Route
          render={() => {
            if (loading) {
              return <LoadingOverlay />;
            }
            if (!isGlobalUserAuthorized) {
              return <Redirect to="/login" />;
            }
            if (shouldRenderTransferMarkings()) {
              return <Redirect to="/transfer-markings" />;
            }

            return (
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
                  path="/challenges/:id"
                  render={() => (
                    <ViewContainer>
                      <ChallengePage />
                    </ViewContainer>
                  )}
                />
                <Route
                  path="/challenges"
                  render={() => (
                    <ViewContainer>
                      <ChallengesPage />
                    </ViewContainer>
                  )}
                />
                <Route
                  path="/profile/:userName/:participationId"
                  render={() => (
                    <ViewContainer>
                      <ParticipationPage />
                    </ViewContainer>
                  )}
                />
                <Route
                  path="/profile/:userName"
                  render={() => (
                    <ViewContainer>
                      <ProfilePage />
                    </ViewContainer>
                  )}
                />

                <Route
                  path="/challenges"
                  render={() => (
                    <ViewContainer>
                      <ChallengesPage />
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
                <Route
                  path="/design-some"
                  render={() => (
                    <ViewContainer isPlain>
                      <SomeDesignPage />
                    </ViewContainer>
                  )}
                />
                <Route
                  path="/welcome-user"
                  render={() => <WelcomeUserPage />}
                />

                <Route path="*" render={() => <NotFoundPage />} />
              </Switch>
            );
          }}
        />
      </Switch>
    </>
  );
};

export default Routes;
