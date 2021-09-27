/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_getUser_activeParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
}

export interface GetUser_getUser_activeParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface GetUser_getUser_activeParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  startDate: any | null;
  endDate: any | null;
  challenge: GetUser_getUser_activeParticipation_challenge;
  markings: GetUser_getUser_activeParticipation_markings[];
}

export interface GetUser_getUser {
  __typename: "User";
  name: string;
  email: string | null;
  isPrivate: boolean;
  finishedAndCheckedParticipations: string[];
  hasCheckedLatestUpdate: boolean;
  activeParticipation: GetUser_getUser_activeParticipation | null;
}

export interface GetUser {
  getUser: GetUser_getUser | null;
}

export interface GetUserVariables {
  name: string;
  activeParticipationId?: string | null;
}
