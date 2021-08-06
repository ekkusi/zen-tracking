/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ParticipationFilters } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetParticipationsPlain
// ====================================================

export interface GetParticipationsPlain_getParticipations_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
}

export interface GetParticipationsPlain_getParticipations {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: GetParticipationsPlain_getParticipations_challenge;
}

export interface GetParticipationsPlain {
  getParticipations: GetParticipationsPlain_getParticipations[];
}

export interface GetParticipationsPlainVariables {
  filters?: ParticipationFilters | null;
}
