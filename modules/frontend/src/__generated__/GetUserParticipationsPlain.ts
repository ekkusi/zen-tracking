/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeFilters } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetUserParticipationsPlain
// ====================================================

export interface GetUserParticipationsPlain_getUserParticipations_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
}

export interface GetUserParticipationsPlain_getUserParticipations {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: GetUserParticipationsPlain_getUserParticipations_challenge;
}

export interface GetUserParticipationsPlain {
  getUserParticipations: GetUserParticipationsPlain_getUserParticipations[];
}

export interface GetUserParticipationsPlainVariables {
  filters?: ChallengeFilters | null;
}
