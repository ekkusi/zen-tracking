/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ParticipationFilters, ChallengeStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetParticipations
// ====================================================

export interface GetParticipations_getParticipations_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
}

export interface GetParticipations_getParticipations {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  startDate: any | null;
  endDate: any | null;
  challenge: GetParticipations_getParticipations_challenge;
}

export interface GetParticipations {
  getParticipations: GetParticipations_getParticipations[];
}

export interface GetParticipationsVariables {
  filters?: ParticipationFilters | null;
}
