/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserTransferParticipationQuery
// ====================================================

export interface GetUserTransferParticipationQuery_getUserTransferParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface GetUserTransferParticipationQuery_getUserTransferParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
}

export interface GetUserTransferParticipationQuery_getUserTransferParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: GetUserTransferParticipationQuery_getUserTransferParticipation_challenge;
  markings: GetUserTransferParticipationQuery_getUserTransferParticipation_markings[];
}

export interface GetUserTransferParticipationQuery {
  getUserTransferParticipation: GetUserTransferParticipationQuery_getUserTransferParticipation | null;
}
