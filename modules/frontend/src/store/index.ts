import React from "react";
import globalHook from "use-global-hook";
import actions from "./actions";
import { GlobalState, ActionTypes } from "./types";

const initialState: GlobalState = {
  currentUser: null,
};

const useGlobal = globalHook<GlobalState, ActionTypes>(
  React,
  initialState,
  actions
);

export default useGlobal;
