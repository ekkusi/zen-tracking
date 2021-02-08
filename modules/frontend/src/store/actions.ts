import { User } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { Store } from "use-global-hook";
import { ActionTypes, GlobalState } from "./types";

const actions = {
  updateUser: (
    store: Store<GlobalState, ActionTypes>,
    user: User | null
  ): void => {
    if (user) localStorage.setItem("currentUser", user.name);
    else localStorage.removeItem("currentUser");
    store.setState({ currentUser: user });
  },
};

export default actions;
