/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetWholeParticipation
// ====================================================

export interface GetWholeParticipation_getParticipation_challenge_creator {
  __typename: "User";
  name: string;
}

export interface GetWholeParticipation_getParticipation_challenge_participations_user {
  __typename: "User";
  name: string;
}

export interface GetWholeParticipation_getParticipation_challenge_participations {
  __typename: "ChallengeParticipation";
  id: string;
  startDate: any | null;
  endDate: any | null;
  user: GetWholeParticipation_getParticipation_challenge_participations_user;
}

export interface GetWholeParticipation_getParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  createdAt: any;
  description: string;
  isPrivate: boolean;
  creator: GetWholeParticipation_getParticipation_challenge_creator;
  participations: GetWholeParticipation_getParticipation_challenge_participations[];
}

export interface GetWholeParticipation_getParticipation_user {
  __typename: "User";
  name: string;
  email: string | null;
  isPrivate: boolean;
  finishedAndCheckedParticipations: string[];
  hasCheckedLatestUpdate: boolean;
}

export interface GetWholeParticipation_getParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface GetWholeParticipation_getParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  startDate: any | null;
  endDate: any | null;
  challenge: GetWholeParticipation_getParticipation_challenge;
  user: GetWholeParticipation_getParticipation_user;
  markings: GetWholeParticipation_getParticipation_markings[];
}

export interface GetWholeParticipation {
  getParticipation: GetWholeParticipation_getParticipation | null;
}

export interface GetWholeParticipationVariables {
  id: string;
}
