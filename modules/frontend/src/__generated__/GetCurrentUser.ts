/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetCurrentUser
// ====================================================

export interface GetCurrentUser_getCurrentUser_activeParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
}

export interface GetCurrentUser_getCurrentUser_activeParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface GetCurrentUser_getCurrentUser_activeParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  startDate: any | null;
  endDate: any | null;
  challenge: GetCurrentUser_getCurrentUser_activeParticipation_challenge;
  markings: GetCurrentUser_getCurrentUser_activeParticipation_markings[];
}

export interface GetCurrentUser_getCurrentUser {
  __typename: "User";
  name: string;
  email: string | null;
  isPrivate: boolean;
  finishedAndCheckedParticipations: string[];
  activeParticipation: GetCurrentUser_getCurrentUser_activeParticipation | null;
}

export interface GetCurrentUser {
  getCurrentUser: GetCurrentUser_getCurrentUser;
}

export interface GetCurrentUserVariables {
  activeParticipationId?: string | null;
}
