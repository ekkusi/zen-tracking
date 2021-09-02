import { useApolloClient } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import LoadingOverlay from "components/general/LoadingOverlay";
import ModalTemplate from "components/general/ModalTemplate";
import { GET_CURRENT_USER } from "generalQueries";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
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
import { AnimatePresence } from "framer-motion";
import { isAfter } from "date-fns";
import WelcomeUserPage from "../views/welcome-user/WelcomeUserPage";
import { refreshToken } from "../util/accessToken";
import ChallengePage from "../views/challenges/challenge/ChallengePage";
import {
  GetCurrentUser,
  GetCurrentUserVariables,
} from "../__generated__/GetCurrentUser";
import ProfilePage from "../views/profile/ProfilePage";
import ParticipationPage from "../views/profile/participation/ParticipationPage";
import useOpenRecapModal from "../hooks/useOpenRecapModal";

const NON_AUTHENTICATED_PATHS = ["/welcome", "/login"];

const Routes = (): JSX.Element => {
  const [globalState, globalActions] = useGlobal();
  const [loading, setLoading] = useState(true);
  const [hasTriedLoggingIn, setHasTriedLoggingIn] = useState(false);
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);
  const [hasRenderedMainPage, setHasRenderedMainPage] = useState(false);

  const { activeParticipation, currentUser, hideNavigation } = globalState;

  const client = useApolloClient();

  const openRecapModal = useOpenRecapModal();

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

  const location = useLocation<{ isRecap?: boolean }>();
  const isRecap = location.state?.isRecap ?? false;

  const updateCurrentUser = useCallback(async () => {
    await refreshToken();

    // If path that is rendered requires authentication, try fetch user.
    // If token has expired, ApolloProvider will throw an error and redirect to /login
    if (!NON_AUTHENTICATED_PATHS.includes(location.pathname)) {
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

        if (
          newActiveParticipation &&
          isAfter(new Date(), new Date(newActiveParticipation.endDate)) &&
          !user.finishedAndCheckedChallenges.includes(
            newActiveParticipation.challenge.id
          )
        ) {
          openRecapModal(newActiveParticipation.challenge, user.name);
        }
      } catch (err) {
        globalActions.updateUser(null);
      }
    }

    setLoading(false);
  }, [client, globalActions, location, openRecapModal]);

  const currentPath = location.pathname;

  // Handle logging in with localStorage cache
  useEffect(() => {
    let isMounted = true;
    // Try to login if hasn't been triggered yet
    if (!hasTriedLoggingIn && isMounted) {
      setHasTriedLoggingIn(true);
      updateCurrentUser();
    }

    // Add Google Analytics stuff
    if (isMounted && previousRoute !== currentPath) {
      setPreviousRoute(currentPath);
      ReactGA.pageview(currentPath);
    }

    // Make navigations visible, if they are not and is not in Participation recap
    if (isMounted && !isRecap && hideNavigation) {
      globalActions.setHideNavigation(false);
    }

    // Set hasRenderedMainPage after 1 second, so previous animations can be through. A little bit schetchy solution.
    if (isMounted && location.pathname === "/" && !hasRenderedMainPage) {
      setTimeout(() => {
        setHasRenderedMainPage(true);
      }, 1000);
    }
    return () => {
      isMounted = false;
    };
  }, [
    hasTriedLoggingIn,
    updateCurrentUser,
    globalState,
    hasRenderedMainPage,
    previousRoute,
    currentPath,
    isRecap,
    location,
    hideNavigation,
    globalActions,
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
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route
            path="/login"
            render={() => {
              return (
                <ViewContainer
                  isPlain
                  animatePageTransition
                  exitAnimation={{ x: "-100vw" }}
                >
                  <LoginPage />
                </ViewContainer>
              );
            }}
          />
          <Route
            path="/transfer-markings"
            render={() => {
              if (shouldRenderTransferMarkings()) {
                return (
                  <ViewContainer isPlain animatePageTransition>
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
                <ViewContainer
                  hideNavigation
                  isPlain
                  isFullWidth
                  animatePageTransition
                >
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
              // This probably shouldn't trigger anymore, but can be kept here, if we want to do something similar in the future
              if (shouldRenderTransferMarkings()) {
                return <Redirect to="/transfer-markings" />;
              }

              return (
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => {
                      return (
                        <ViewContainer
                          animatePageTransition={!hasRenderedMainPage}
                          transition={{
                            duration: 0.5,
                          }}
                        >
                          <MainPage />
                        </ViewContainer>
                      );
                    }}
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
                    path="/profile/:userName/participations/:participationId"
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
                      <ViewContainer>
                        <SomeDesignPage />
                      </ViewContainer>
                    )}
                  />
                  <Route
                    path="/welcome-user"
                    render={() => (
                      <ViewContainer
                        hideNavigation
                        isPlain
                        isFullWidth
                        animatePageTransition
                        animation={{
                          from: { x: "100vw" },
                          to: { x: 0 },
                        }}
                        exitAnimation={{
                          x: "-100vw",
                        }}
                      >
                        <WelcomeUserPage />
                      </ViewContainer>
                    )}
                  />
                  <Route path="*" render={() => <NotFoundPage />} />
                </Switch>
              );
            }}
          />
        </Switch>
      </AnimatePresence>
    </>
  );
};

export default Routes;
