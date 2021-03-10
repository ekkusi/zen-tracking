import {
  ParsedChallengeParticipation,
  ParsedUser,
} from "types/parsedBackendTypes";
import { Store } from "use-global-hook";
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
  updateActiveParticipation: (
    store: Store<GlobalState, ActionTypes>,
    participation: ParsedChallengeParticipation
  ): void => {
    store.setState({
      ...store.state,
      activeParticipation: participation,
    });
  },
};

export default actions;
