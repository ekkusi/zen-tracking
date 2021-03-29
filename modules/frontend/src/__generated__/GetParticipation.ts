/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetParticipation
// ====================================================

export interface GetParticipation_getParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
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
  challenge: GetParticipation_getParticipation_challenge;
  markings: GetParticipation_getParticipation_markings[];
}

export interface GetParticipation {
  getParticipation: GetParticipation_getParticipation | null;
}

export interface GetParticipationVariables {
  challengeId: string;
}
