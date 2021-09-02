/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetParticipation
// ====================================================

export interface GetParticipation_getParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
}

export interface GetParticipation_getParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface GetParticipation_getParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  startDate: any | null;
  endDate: any | null;
  challenge: GetParticipation_getParticipation_challenge;
  markings: GetParticipation_getParticipation_markings[];
}

export interface GetParticipation {
  getParticipation: GetParticipation_getParticipation | null;
}

export interface GetParticipationVariables {
  id: string;
}
