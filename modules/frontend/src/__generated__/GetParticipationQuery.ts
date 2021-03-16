/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetParticipationQuery
// ====================================================

export interface GetParticipationQuery_getParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface GetParticipationQuery_getParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
}

export interface GetParticipationQuery_getParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: GetParticipationQuery_getParticipation_challenge;
  markings: GetParticipationQuery_getParticipation_markings[];
}

export interface GetParticipationQuery {
  getParticipation: GetParticipationQuery_getParticipation | null;
}

export interface GetParticipationQueryVariables {
  challengeId: string;
}
