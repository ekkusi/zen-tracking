import { Store } from "use-global-hook";
import UserInfoUtil from "util/UserInfoUtil";
import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { GetUserTransferParticipationQuery } from "__generated__/GetUserTransferParticipationQuery";
import LogRocket from "logrocket";
import { AuthenticatedUser } from "@ekkusi/zen-tracking-backend/lib/types/customContext";
import { GetUserParticipationsQuery } from "../__generated__/GetUserParticipationsQuery";
import {
  GET_USER_PARTICIPATIONS,
  GET_USER_TRANSFER_PARTICIPATION,
  LOGOUT,
} from "../generalQueries";
import { initializeApollo } from "../apollo/ApolloProvider";
import { notAuthorizedUser } from "./notAuthenticatedUser";
import { ActionTypes, GlobalState } from "./types";
import { setAccessToken } from "../util/accessToken";

const actions = {
  updateUser: (
    store: Store<GlobalState, ActionTypes>,
    user: AuthenticatedUser | null
  ): void => {
    if (user) {
      localStorage.setItem("currentUser", user.name);
      // Init LogRocket session if user is not private and is prod env
      if (process.env.NODE_ENV === "production" && !user.isPrivate) {
        LogRocket.init("6hrsm3/zen-tracking");
        LogRocket.identify(user.name);
      }
    } else localStorage.removeItem("currentUser");
    store.setState({ ...store.state, currentUser: user || notAuthorizedUser });
  },
  updateError: (
    store: Store<GlobalState, ActionTypes>,
    error: string | null
  ): void => {
    store.setState({ ...store.state, error });
  },
  updateActiveParticipation: async (
    store: Store<GlobalState, ActionTypes>,
    newChallengeId?: string | null
  ): Promise<void> => {
    const client = initializeApollo();

    let participation = null;

    // If newChallengeId is passed explicitly (its defined or null) -> set to this.
    // Otherwise try to get challengeId from localStorage, if one exists, if not put fallback to undefined
    const challengeId =
      newChallengeId || newChallengeId === null
        ? newChallengeId
        : localStorage.getItem("activeParticipationChallengeId") ?? undefined;

    try {
      // If no challengeId is given, check first if user has some markings not transferred (== is participation in NO_PARTICIPATION_MARKINGS_HOLDER)
      // and set activeParticipation to this if one is found
      if (challengeId === undefined) {
        const {
          data: { getUserTransferParticipation },
        } = await client.query<GetUserTransferParticipationQuery>({
          query: GET_USER_TRANSFER_PARTICIPATION,
          fetchPolicy: "no-cache",
        });

        if (getUserTransferParticipation) {
          store.setState({
            ...store.state,
            activeParticipation: getUserTransferParticipation,
          });
          return; // Stop running rest of the update
        }
      }

      // Otherwise fetch user participations and get the one with given challengeId or the one with latest marking, if no challengeId is given
      const {
        data: { getUserParticipations: participations },
      } = await client.query<GetUserParticipationsQuery>({
        query: GET_USER_PARTICIPATIONS,
        fetchPolicy: "no-cache",
      });
      // challengeId is null, null activeParticipation
      if (challengeId === null) {
        participation = null;
      } else {
        const matchingParticipation = participations.find(
          (it) => it.challenge.id === challengeId
        );
        // Otherwise if matching to given id participation is found, put to this
        if (matchingParticipation) {
          participation = matchingParticipation;
        } else {
          // Otherwise get latestmodifiedparticipation
          const activeParticipation = UserInfoUtil.getLatestModifiedParticipation(
            participations
          );
          participation = activeParticipation;
        }
      }
    } catch (error) {
      console.log(error); // This should be caught by global error handler
    }

    // Set returned participation to store and localStorage, if is null, empty localStorage
    if (participation)
      localStorage.setItem(
        "activeParticipationChallengeId",
        participation.challenge.id
      );
    else localStorage.removeItem("activeParticipationChallengeId");
    store.setState({
      ...store.state,
      activeParticipation: participation,
    });
  },
  updateActiveParticipationMarkings: (
    store: Store<GlobalState, ActionTypes>,
    markings: Marking[]
  ): void => {
    if (store.state.activeParticipation) {
      store.setState({
        ...store.state,
        activeParticipation: {
          ...store.state.activeParticipation,
          markings,
        },
      });
    }
  },
  logout: async (store: Store<GlobalState, ActionTypes>): Promise<void> => {
    const client = initializeApollo();

    await client.mutate({ mutation: LOGOUT });
    client.clearStore();
    store.setState({
      ...store.state,
      currentUser: notAuthorizedUser,
      activeParticipation: null,
    });
    setAccessToken(null);
  },
};

export default actions;
