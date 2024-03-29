import { Store } from "use-global-hook";
import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { AuthenticatedUser } from "@ekkusi/zen-tracking-backend/lib/types/customContext";
import ReactGA from "react-ga";
import { LOGOUT } from "../generalQueries";
import { initializeApollo } from "../apollo/ApolloProvider";
import { notAuthorizedUser } from "./notAuthenticatedUser";
import { ActionTypes, ActiveParticipation, GlobalState } from "./types";
import { setAccessToken } from "../util/accessToken";
import { ConfirmationModalProps } from "../components/general/ConfirmationModal";

const actions = {
  updateUser: (
    store: Store<GlobalState, ActionTypes>,
    user: AuthenticatedUser | null
  ): void => {
    if (user) {
      localStorage.setItem("currentUser", user.name);
      // Add user name to Google Analytics
      ReactGA.set({
        userId: user.name,
      });
      // Init LogRocket session if user is not private and is prod env
      // if (process.env.NODE_ENV === "production" && !user.isPrivate) {
      //   LogRocket.init("6hrsm3/zen-tracking");
      //   LogRocket.identify(user.name);
      // }
    } else localStorage.removeItem("currentUser");
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
    participation: ActiveParticipation | null
  ): void => {
    if (participation) {
      localStorage.setItem("activeParticipationId", participation.id);
    } else {
      localStorage.removeItem("activeParticipationId");
    }

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
  updatePromptEvent: (
    store: Store<GlobalState, ActionTypes>,
    event: BeforeInstallPromptEvent | null
  ): void => {
    store.setState({
      ...store.state,
      promptEvent: event,
    });
  },
  setHideNavigation: (
    store: Store<GlobalState, ActionTypes>,
    state: boolean
  ): void => {
    store.setState({
      ...store.state,
      hideNavigation: state,
    });
  },
  setModal: (
    store: Store<GlobalState, ActionTypes>,
    props: ConfirmationModalProps
  ): void => {
    store.setState({
      ...store.state,
      modalProps: props,
    });
  },
  setBottomNavigationBarState: (
    store: Store<GlobalState, ActionTypes>,
    state: "hidden" | "visible"
  ): void => {
    store.setState({ ...store.state, bottomNavigationBarState: state });
  },
};

export default actions;
