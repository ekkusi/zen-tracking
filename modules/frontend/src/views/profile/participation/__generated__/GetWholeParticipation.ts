/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetWholeParticipation
// ====================================================

export interface GetWholeParticipation_getParticipation_user {
  __typename: "User";
  name: string;
  isPrivate: boolean;
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

export interface GetWholeParticipation_getParticipation_challenge_creator {
  __typename: "User";
  name: string;
}

export interface GetWholeParticipation_getParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  creator: GetWholeParticipation_getParticipation_challenge_creator;
}

export interface GetWholeParticipation_getParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  user: GetWholeParticipation_getParticipation_user;
  markings: GetWholeParticipation_getParticipation_markings[];
  challenge: GetWholeParticipation_getParticipation_challenge;
}

export interface GetWholeParticipation {
  getParticipation: GetWholeParticipation_getParticipation | null;
}

export interface GetWholeParticipationVariables {
  challengeId: string;
  userName: string;
}
