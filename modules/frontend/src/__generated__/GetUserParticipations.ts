/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetUserParticipations
// ====================================================

export interface GetUserParticipations_getUserParticipations_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
  status: ChallengeStatus;
}

export interface GetUserParticipations_getUserParticipations_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface GetUserParticipations_getUserParticipations {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  challenge: GetUserParticipations_getUserParticipations_challenge;
  markings: GetUserParticipations_getUserParticipations_markings[];
}

export interface GetUserParticipations {
  getUserParticipations: GetUserParticipations_getUserParticipations[];
}
