/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetUserTransferParticipation
// ====================================================

export interface GetUserTransferParticipation_getUserTransferParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
  status: ChallengeStatus;
}

export interface GetUserTransferParticipation_getUserTransferParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface GetUserTransferParticipation_getUserTransferParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  challenge: GetUserTransferParticipation_getUserTransferParticipation_challenge;
  markings: GetUserTransferParticipation_getUserTransferParticipation_markings[];
}

export interface GetUserTransferParticipation {
  getUserTransferParticipation: GetUserTransferParticipation_getUserTransferParticipation | null;
}
