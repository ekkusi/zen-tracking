import React from "react";
import globalHook from "use-global-hook";
import actions from "./actions";
import { notAuthorizedUser } from "./notAuthenticatedUser";
import { GlobalState, ActionTypes } from "./types";

const initialState: GlobalState = {
  currentUser: notAuthorizedUser,
  error: null,
  activeParticipation: null,
  accessToken: null,
  promptEvent: null,
  hideNavigation: false,
};

const useGlobal = globalHook<GlobalState, ActionTypes>(
  React,
  initialState,
  actions
);

export default useGlobal;
