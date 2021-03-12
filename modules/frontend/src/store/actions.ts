import { initializeApollo } from "apollo/ApolloProvider";
import {
  ParsedChallengeParticipation,
  ParsedUser,
} from "types/parsedBackendTypes";
import { Store } from "use-global-hook";
import UserInfoUtil from "util/UserInfoUtil";
import { GET_USER_PARTICIPATIONS } from "views/login/loginQueries";
import {
  GetUserParticipationsQuery,
  GetUserParticipationsQueryVariables,
} from "views/login/__generated__/GetUserParticipationsQuery";
import { notAuthorizedUser } from "./notAuthenticatedUser";
import { ActionTypes, GlobalState } from "./types";

const actions = {
  updateUser: (
    store: Store<GlobalState, ActionTypes>,
    user: ParsedUser | null
  ): void => {
    if (user) localStorage.setItem("currentUser", user.name);
    else localStorage.removeItem("currentUser");
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
    participation?: ParsedChallengeParticipation | null
  ): Promise<void> => {
    const client = initializeApollo();

    // If participation is passed, set this.
    if (participation || participation === null) {
      store.setState({
        ...store.state,
        activeParticipation: participation,
      });
    } else {
      // Otherwise fetch user participations and get latestmodifiedparticipation, general method
      try {
        const participationsResult = await client.query<
          GetUserParticipationsQuery,
          GetUserParticipationsQueryVariables
        >({
          query: GET_USER_PARTICIPATIONS,
          variables: {
            userName: store.state.currentUser.name,
          },
          fetchPolicy: "no-cache",
        });

        const participations = participationsResult.data.getUserParticipations;
        const activeParticipation = UserInfoUtil.getLatestModifiedParticipation(
          participations
        );
        store.setState({
          ...store.state,
          activeParticipation,
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
};

export default actions;
